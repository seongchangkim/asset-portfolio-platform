import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import BASE_URL from "@/global/base_url";
import axios from "axios";
import { useState, useEffect } from "react";

import Link from "next/link";

import { setMemberState } from "@/store/member/member_slice";
import { useDispatch } from "react-redux";
import { setAssetPortfolioState } from "@/store/asset_portfolio/asset_portfolio_slice";
import kakaoLoginConfig from "@/global/kakao/config";
import googleLoginConfig from "@/global/google/config";
import Image from 'next/legacy/image';

// 로그인 및 회원가입 입력폼 컴포넌트 동적 가져오기  
const MemberInputForm = dynamic(() => import("@/components/member/member_input_form"),{
    ssr: false
});
// 로그인 및 회원가입 버튼 컴포넌트 동적 가져오기 
const MemberBtn = dynamic(() => import("@/components/member/member_btn"), {
    ssr: false
});

const Login = () => {   
    const router = useRouter();
    const { replace } = router; 

    const dispatch = useDispatch();

    useEffect(() => {
        // 자산 포트폴리오 상태값을 빈 값으로 변경
        dispatch(setAssetPortfolioState({}));
        // 회원 상태값을 빈 값으로 변경
        dispatch(setMemberState({}));
    }, []);
    
    // 로그인 
    const loginClick = async () => {
        const param = {
            email, password
        };

        // 로그인 API 호출
        const res = await axios.post(`${BASE_URL}/api/member/login`, param);

        const { success, member, portfolio, assets, warningMessage } = res.data;

        // 로그인 성공 시
        if(success){
            // 로그인 API의 response값을 Member 저장소에 저장함.
            dispatch(setMemberState({
                id: member.id,
                email: member.email,
                name: member.name,
                profile: member.profileUrl,
                tel: member.tel,
                authRole: member.authRole,
                socialLoginType: member.socialLoginType,
                token : member.token
            }));
            // 로그인 API의 response값을 Asset Portfoilio 저장소에 저장함.
            dispatch(setAssetPortfolioState({
                portfolio,
                assets
            }));
            replace("/");
        }else if(warningMessage !== undefined){
            alert(warningMessage);
        }
    }

    // 카카오 로그인
    const KakaoLoginClick = () => {
        window.Kakao.Auth.authorize({
            redirectUri: kakaoLoginConfig.redirect_url
        });
    }

    const googleLoginClick = () => location.href = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${googleLoginConfig.client_id}&redirect_uri=${googleLoginConfig.redirect_url}&response_type=code&scope=email profile`;

    // 이메일 
    const [email, setEmail] = useState("");
    // 비밀번호
    const [password, setPassword] = useState("");

    return (
        <div className="flex min-h-full flex-col items-center justify-center px-6 py-12 lg:px-8">
            
            
            <div className="flex justify-center sm:mx-auto sm:w-full sm:max-w-sm">
                <Image
                    src="/next.svg"
                    alt="Next.js Logo"
                    width={180}
                    height={37}
                    priority
                />
                {/* <img className="mx-auto h-10 w-auto" src="https://tailwindui.com/img/logos/mark.svg?color=indigo&shade=600" alt="Your Company" /> */}
                {/* <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">로그인</h2> */}
            </div>

            <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
                <div className="space-y-6">
                    {/* 이메일 */}
                    <MemberInputForm inputState={email} setInputState={setEmail} label="이메일" type="email" />
                    {/* 비밀번호 */}
                    <MemberInputForm inputState={password} setInputState={setPassword} label="비밀번호" type="password" />
                    
                    <p className="text-center text-sm">
                        회원이 존재하지 않습니까? 
                        <Link href="/member/register" prefetch={false}>
                            <span className="px-1 text-sm text-blue-600">
                                    회원가입하기
                            </span>
                        </Link>
                    </p> 
                    
                    <MemberBtn text="로그인" onClick={loginClick}/>
                    
                    <div className="flex justify-between items-center w-96">
                        <hr className="my-4 w-40"/>
                        <span className="text-sm text-gray-500">또는</span>
                        <hr className="my-4 w-40"/>
                    </div>

                    <div
                        className="w-96"
                    >
                        <div
                            onClick={KakaoLoginClick}
                            className="flex justify-around items-center bg-amber-300 w-full h-10 mb-5"
                        >
                            <div className="w-12 pt-1">
                                <Image 
                                    src="/icons/kakaotalk-logo.png"
                                    width="32px"
                                    height="32px"
                                />
                            </div>
                            <div className="text-sm w-44 font-semibold cursor-default">
                                <p>카카오 로그인</p>
                            </div>
                        </div>
                        <div
                            onClick={googleLoginClick}
                            className="flex justify-around items-center bg-white w-full h-10 border border-gray-400"
                        >
                            <div className="w-12 pt-1">
                                <Image 
                                    src="/icons/google-logo.png"
                                    width="24px"
                                    height="24px"
                                />
                            </div>
                            <div className="text-sm w-44 font-semibold cursor-default">
                                <p className="ml-2">구글 로그인</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Login;