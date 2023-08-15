import MemberInputForm from "@/components/member/member_input_form";
import { useState, useEffect } from "react";
import axios from "axios";
import BASE_URL from "@/global/base_url";
import { useRouter } from 'next/router'
import MemberBtn from "@/components/member/member_btn";
import { useDispatch, useSelector } from "react-redux";
import { setMemberState, getMemberState } from "@/store/member/member_slice";

const Register = () => {
    const router = useRouter();
    const { replace } = router;

    const getMember = useSelector(getMemberState);
    const dispatch = useDispatch();

    // 이메일 
    const [email, setEmail] = useState("");
    // 비밀번호
    const [password, setPassword] = useState("");
    // 이름
    const [name, setName] = useState("");
    // 전화번호
    const [tel, setTel] = useState("");
    // 소셜 로그인 종류
    const [socialLoginKind, setSocialLoginKind] = useState("");

    // 회원가입 이벤트
    const registerClick = async () => {
        const social_login_type = socialLoginKind.length === 0 ? "NONE" : socialLoginKind;

        const param = {
            email,
            password,
            name,
            tel,
            social_login_type
        };

        const res = await axios.post(`${BASE_URL}/api/member`, param);
        
        const data = res.data;

        if(data["success"]){
            if(socialLoginKind.length === 0){
                replace("/member/login")
            }else{
                const socialLoginRes = await axios.post(`/api/member/social-login/${socialLoginKind}`, {
                    token: getMember.token,
                    email,
                    name
                });

                const { member, portfolio, assets } = socialLoginRes.data;
        
                dispatch(setMemberState({
                    id: member.member_id,
                    email: member.email,
                    name: member.name,
                    profile: member.profile_url,
                    tel: member.tel,
                    authRole: member.auth_role,
                    socialLoginType: member.social_login_type
                }));
                replace("/");
                
                return;
            }   
        }
    };

    const setKakaoLoginRegisterState = async () => {
        if(router.isReady){
            if(router.query !== {}){
                const { email, name, socialLoginKind } = router.query;

                setEmail(email ?? "");
                setName(name ?? "");
                setSocialLoginKind(socialLoginKind ?? "");
            }
        }

        return () => {};
    }

    useEffect(() => {
        setKakaoLoginRegisterState();
    }, [router.isReady])

    return (
        <div className="flex min-h-full flex-col justify-center px-6 py-12 lg:px-8">
            <div className="sm:mx-auto sm:w-full sm:max-w-sm">
                {/* <img className="mx-auto h-10 w-auto" src="https://tailwindui.com/img/logos/mark.svg?color=indigo&shade=600" alt="Your Company"/> */}
                <h2 className="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">회원가입</h2>
            </div>

            <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
                <div className="space-y-6">
                    {/* 이메일 */}
                    <MemberInputForm inputState={email} setInputState={setEmail} label="이메일" type="email" />
                    {/* 비밀번호 */}
                    {
                        socialLoginKind.length === 0 ? 
                        <MemberInputForm inputState={password} setInputState={setPassword} label="비밀번호" type="password" /> :
                        <></>
                    }
                    
                    {/* 이름 */}
                    <MemberInputForm inputState={name} setInputState={setName} label="이름" type="name" />
                    {/* 전화번호 */}
                    <MemberInputForm inputState={tel} setInputState={setTel} label="전화번호" type="tel" />
                    <MemberBtn text="회원가입" onClick={registerClick}/>
                </div>
            </div>
        </div>        
    );
}

export default Register;