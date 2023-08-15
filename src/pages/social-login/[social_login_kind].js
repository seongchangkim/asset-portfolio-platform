import { useRouter } from "next/router";
import { useEffect, useCallback } from "react";
import axios from "axios";
import { useDispatch } from "react-redux";
import { setMemberState } from "@/store/member/member_slice";
import { setAssetPortfolioState} from "@/store/asset_portfolio/asset_portfolio_slice";
import Loading from "@/components/util/loading";

const SocialLoginLoadingPage = () => {
    const router = useRouter();
    const { push, replace } = router;

    const dispatch = useDispatch();

    const socialLoginHandle = useCallback(
        async (code, kind) => {
            const socialLoginKind = kind.toUpperCase();

            const res = await axios.post(`/api/member/social-login/${socialLoginKind}`, {
                authCode : code
            });

            const {success, member, portfolio, assets, inputState} = res.data;

            if(success){
                if(member !== undefined){
                    // 소셜로그인 API response 깂을 Member 상태 저장소 저장
                    dispatch(setMemberState({
                        id: member.member_id,
                        email: member.email,
                        name: member.name,
                        profile: member.profile_url,
                        tel: member.tel,
                        authRole: member.auth_role,
                        socialLoginType: member.social_login_type
                    }));
                    // 소셜로그인 API response 깂을 Asset Portfolio 상태 저장소 저장
                    dispatch(setAssetPortfolioState({
                        portfolio,
                        assets
                    }))
                    replace("/");
                }else {
                    dispatch(setMemberState({
                        token: inputState.token
                    }));
                    push({
                        pathname : "/member/register",
                        query: { 
                            name: inputState.name,
                            email: inputState.email,
                            socialLoginKind: kind,
                        }
                    });
                }
            }

            return;
        },
        [router]
    );

    useEffect(() => {
        if(router.isReady){
            const { code, social_login_kind
            } = router.query;
            
            socialLoginHandle(code, social_login_kind);
        }
    }, [router.isReady]);

    return (
        <Loading content="소셜 로그인 중입니다.."/>
    );
}

export default SocialLoginLoadingPage;