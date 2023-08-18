import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import axios from "axios";

// firebase storage
import { deleteObject, getDownloadURL, listAll, ref, uploadBytes, uploadString } from 'firebase/storage';
import { fStorage } from "@/global/firebase";

// dynamic import(next.js 코드 분할 작업)
import dynamic from "next/dynamic";
// next/legacy/image 적용
import Image from "next/legacy/image";

// DashBoard 컴포넌트 dynamic import하도록 설정
const DashBoard = dynamic(() => import("@/dashboard"), {
    ssr: false
});

// 회원 상세보기 입력폼 컴포넌트 dynamic import하도록 설정
const MemberDetailInputForm = dynamic(() => import("@/components/member/member_detail_input_form"), {
    ssr: false
});

// 회원 상세보기 라디오 버튼 컴포넌트 dynamic import하도록 설정
const MemberRadioBtn = dynamic(() => import("@/components/member/member_radio_btn"), {
    ssr: false
});

// 회원 상세보기 버튼 컴포넌트 dynamic import하도록 설정
const MemberDetailBtn = dynamic(() => import("@/components/member/member_detail_btn"), {
    ssr: false
});

const Member = () => {

    const router = useRouter();
    const { push } = router;
    
    const [memberId, setMemberId] = useState(0);
    // 이름
    const [name, setName] = useState("");
    // 전화번호 
    const [tel, setTel] = useState("");
    // 권한
    const [authRole, setAuthRole] = useState("");
    // 프로필 사진
    const [profileUrl, setProfileUrl] = useState("");
    // file 객체
    const [file, setFile] = useState({});
    // 이메일
    const [email, setEmail] = useState("");
    // 소셜 로그인
    const [socialLoginType, setSocialLoginType] = useState("");

    const getMemberInfo = async () => {
        if(router.isReady){
            const { id } = router.query;
            setMemberId(id);
            
            const res = await axios.get(`/api/admin/member/${id}`); 
            
            // 회원 이름
            setName(res.data.result[0].name);
            // 회원 전화번호
            setTel(res.data.result[0].tel);
            // 회원 권한
            setAuthRole(res.data.result[0].auth_role);
            // 회원 프로필 사진
            setProfileUrl(res.data.result[0].profile_url);
            // 회원 이메일
            setEmail(res.data.result[0].email);
            // 회원 소셜 로그인
            setSocialLoginType(res.data.result[0].social_login_type);
        }

        return () => {};
    }

    // 빈 객체 체크
    const isEmptyObject = (obj) => {
        return Object.keys(obj).length === 0 && obj.constructor === Object;
    }

    
    // 이미지 프로필 사진 변경
    const onChangeProfileImg = (event) => {
        const file = event.target.files || event.dataTransfer.files;

        if(file === {}) return;

        setFile(file[0]);

        setProfileUrl(URL.createObjectURL(file[0]));
    }

    // 회원 수정
    const onMemberEditing = async () => {
        if(isEmptyObject(file)){
            const params = {
                email, name, tel, profileUrl, authRole 
            }
            memberEditingProcess(params);
        }else{
            const mountainsRef = ref(
                fStorage,
                `profiles/${memberId}/${new Date().getTime()}_${file.name}`
            );

            uploadBytes(mountainsRef, file).then(async (snapshot) => {
                const getUploadImageUrl = await getDownloadURL(snapshot.ref);

                const params = {
                    email,
                    name,
                    tel, 
                    authRole,
                    profileUrl : getUploadImageUrl
                };
    
                memberEditingProcess(params);
            });
        }
    }

    // 회원 수정 공통 부분
    // 회원 수정 API 호출하여 회원 수정 성공하면 알림창 띄우고 강제 새로고침
    const memberEditingProcess = async (params) => {
        const res = await axios.patch(
            `/api/admin/member/${memberId}`,
            params
        );

        if(res.data['success']){
            alert("해당 회원 정보가 수정되었습니다.");
            window.location.reload();
        }
    }

    // 회원 삭제
    const onDeleteMember = async () => {
        const res = await axios.delete(
            `/api/admin/member/${memberId}`
        );

        if(res.data['success']){
            try{
                const memberRef = ref(
                    fStorage,
                    `profiles/${memberId}`
                );

                const getProfileImgs = await listAll(memberRef);

                if(getProfileImgs.items !== []){
                    await deleteObject(memberRef);
                }

            }catch(error){
                console.log(`error : ${error.name}`);
            }

            alert("해당 회원 정보를 삭제되었습니다.");
            push("/members"); 
        }
    }

    useEffect(() => {
        getMemberInfo()
    }, [router.isReady]);

    return (
        <div className="bg-white">
            {/* <div className="container mx-auto bg-white rounded">
                <div className="xl:w-full border-b border-gray-300 dark:border-gray-700 py-5 bg-white dark:bg-gray-800">
                    <div className="flex w-11/12 mx-auto xl:w-full xl:mx-0 items-center">
                        <p className="text-lg text-gray-800 dark:text-gray-100 font-bold">Profile</p>
                        <div className="ml-2 cursor-pointer text-gray-600 dark:text-gray-400">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="16" height="16">
                                <path className="heroicon-ui" d="M12 22a10 10 0 1 1 0-20 10 10 0 0 1 0 20zm0-2a8 8 0 1 0 0-16 8 8 0 0 0 0 16zm0-9a1 1 0 0 1 1 1v4a1 1 0 0 1-2 0v-4a1 1 0 0 1 1-1zm0-4a1 1 0 1 1 0 2 1 1 0 0 1 0-2z" fill="currentColor" />
                            </svg>
                        </div>
                    </div>
                </div>
                <div className="mx-auto">
                    <div className="xl:w-9/12 w-11/12 mx-auto xl:mx-0">
                        <div className="rounded relative mt-8 h-48">
                            <img src="https://cdn.tuk.dev/assets/webapp/forms/form_layouts/form1.jpg" alt="" className="w-full h-full object-cover rounded absolute shadow" />
                            <div className="absolute bg-black opacity-50 top-0 right-0 bottom-0 left-0 rounded"></div>
                            <div className="flex items-center px-3 py-2 rounded absolute right-0 mr-4 mt-4 cursor-pointer">
                                <p className="text-xs text-gray-100">Change Cover Photo</p>
                                <div className="ml-2 text-gray-100">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="icon icon-tabler icon-tabler-edit" width="18" height="18" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">
                                        <path stroke="none" d="M0 0h24v24H0z" />
                                        <path d="M9 7 h-3a2 2 0 0 0 -2 2v9a2 2 0 0 0 2 2h9a2 2 0 0 0 2 -2v-3" />
                                        <path d="M9 15h3l8.5 -8.5a1.5 1.5 0 0 0 -3 -3l-8.5 8.5v3" />
                                        <line x1="16" y1="5" x2="19" y2="8" />
                                    </svg>
                                </div>
                            </div>
                            <div className="w-20 h-20 rounded-full bg-cover bg-center bg-no-repeat absolute bottom-0 -mb-10 ml-12 shadow flex items-center justify-center">
                                <img src="https://cdn.tuk.dev/assets/webapp/forms/form_layouts/form2.jpg" alt="" className="absolute z-0 h-full w-full object-cover rounded-full shadow top-0 left-0 bottom-0 right-0" />
                                <div className="absolute bg-black opacity-50 top-0 right-0 bottom-0 left-0 rounded-full z-0"></div>
                                <div className="cursor-pointer flex flex-col justify-center items-center z-10 text-gray-100">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="icon icon-tabler icon-tabler-edit" width="20" height="20" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">
                                        <path stroke="none" d="M0 0h24v24H0z" />
                                        <path d="M9 7 h-3a2 2 0 0 0 -2 2v9a2 2 0 0 0 2 2h9a2 2 0 0 0 2 -2v-3" />
                                        <path d="M9 15h3l8.5 -8.5a1.5 1.5 0 0 0 -3 -3l-8.5 8.5v3" />
                                        <line x1="16" y1="5" x2="19" y2="8" />
                                    </svg>
                                    <p className="text-xs text-gray-100">Edit Picture</p>
                                </div>
                            </div>
                        </div>
                        <div className="mt-16 flex flex-col xl:w-2/6 lg:w-1/2 md:w-1/2 w-full">
                            <label for="username" className="pb-2 text-sm font-bold text-gray-800 dark:text-gray-100">Username</label>
                            <input tabindex="0" type="text" id="username" name="username" required className="border border-gray-300 dark:border-gray-700 pl-3 py-3 shadow-sm rounded text-sm focus:outline-none focus:border-indigo-700 bg-transparent placeholder-gray-500 text-gray-600 dark:text-gray-400" placeholder="@example" />
                        </div>
                        <div className="mt-8 flex flex-col xl:w-3/5 lg:w-1/2 md:w-1/2 w-full">
                            <label for="about" className="pb-2 text-sm font-bold text-gray-800 dark:text-gray-100">About</label>
                            <textarea id="about" name="about" required className="bg-transparent border border-gray-300 dark:border-gray-700 pl-3 py-3 shadow-sm rounded text-sm focus:outline-none focus:border-indigo-700 resize-none placeholder-gray-500 text-gray-600 dark:text-gray-400" placeholder="Let the world know who you are" rows="5"></textarea>
                            <p className="w-full text-right text-xs pt-1 text-gray-600 dark:text-gray-400">Character Limit: 200</p>
                        </div>
                    </div>
                </div>
            </div> */}
            <div className="container mx-auto bg-white mt-10 ml-10 rounded px-4">
                {/* <div className="xl:w-full border-b border-gray-300 dark:border-gray-700 py-5">
                    <div className="flex w-11/12 mx-auto xl:w-full xl:mx-0 items-center">
                        <p className="text-lg text-gray-800 font-bold">Personal Information</p>
                        <div className="ml-2 cursor-pointer text-gray-600">
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="16" height="16">
                                <path className="heroicon-ui" d="M12 22a10 10 0 1 1 0-20 10 10 0 0 1 0 20zm0-2a8 8 0 1 0 0-16 8 8 0 0 0 0 16zm0-9a1 1 0 0 1 1 1v4a1 1 0 0 1-2 0v-4a1 1 0 0 1 1-1zm0-4a1 1 0 1 1 0 2 1 1 0 0 1 0-2z" fill="currentColor" />
                            </svg>
                        </div>
                    </div>
                </div> */}
                {/* 프로필 이미지 */}
                <div className="flex justify-center">
                    <label
                        for="profileUrl"
                        class="relative cursor-default rounded-md"
                    >
                        <Image
                            width="96px"
                            height="96px"
                            className="rounded-full"
                            src={profileUrl === null ? "/icons/default-user-profile.png" : profileUrl}
                        />

                        <input
                            id="profileUrl"
                            name="profileUrl"
                            type="file"
                            class="sr-only"
                            onChange={onChangeProfileImg}
                        /> 
                    </label>
                </div>
                <div className="mx-auto pt-4 mt-10">
                    <div className="container mx-auto">
                        {/* <form className="my-6 w-11/12 mx-auto xl:w-full xl:mx-0"> */}
                        <div className="flex justify-start items-center">
                            <div className="xl:w-1/3 lg:w-1/2 md:w-1/2 flex flex-col mb-6 mr-48">
                                <label htmlFor="email" className="pb-2 text-sm font-bold text-gray-800">이메일</label>
                                <div className="border border-gray-800 shadow-sm rounded flex">
                                    <div tabIndex="0" className="focus:outline-none px-4 py-3 flex items-center border-r border-gray-800">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="icon icon-tabler icon-tabler-mail" width="20" height="20" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" fill="none" strokeLinecap="round" strokeLinejoin="round">
                                            <path stroke="none" d="M0 0h24v24H0z" />
                                            <rect x="3" y="5" width="18" height="14" rx="2" />
                                            <polyline points="3 7 12 13 21 7" />
                                        </svg>
                                    </div>
                                    {/* 이메일 */}
                                    <input 
                                        tabIndex="0" 
                                        type="text" 
                                        id="email" 
                                        name="email" 
                                        required 
                                        className="pl-3 py-3 w-full text-sm focus:outline-none placeholder-gray-500 rounded bg-transparent text-gray-600 dark:text-gray-400" 
                                        placeholder="example@gmail.com" 
                                        value={email} 
                                        disabled={true}
                                    />
                                </div>
                                {/* <div className="flex justify-between items-center pt-1 text-green-700">
                                    <p className="text-xs">Email submission success!</p>
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="16" height="16">
                                        <path
                                            className="heroicon-ui"
                                            d="M12 22a10 10 0 1 1 0-20 10 10 0 0 1 0 20zm0-2a8 8 0 1 0 0-16 8 8 0 0 0 0 16zm-2.3-8.7l1.3 1.29 3.3-3.3a1 1 0 0 1 1.4 1.42l-4 4a1 1 0
                                    0 1-1.4 0l-2-2a1 1 0 0 1 1.4-1.42z"
                                            stroke="currentColor"
                                            stroke-width="0.25"
                                            stroke-linecap="round"
                                            stroke-linejoin="round"
                                            fill="currentColor"
                                        ></path>
                                    </svg>
                                </div> */}
                            </div>
                            {/* 이름 */}
                            <MemberDetailInputForm label="이름" id="name" inputType="text" value={name} onChange={setName}/>
                        </div>
                        
                        <div className="flex justify-start items-center">
                            {/* 전화번호 */}
                            <MemberDetailInputForm label="전화번호" id="tel" inputType="text" value={tel} onChange={setTel}/>
                            {/* <div className="xl:w-1/4 lg:w-1/2 md:w-1/2 flex flex-col mb-6">
                                <label htmlFor="StreetAddress" className="pb-2 text-sm font-bold text-gray-800">Street Address</label>
                                <input tabindex="0" type="text" id="StreetAddress" name="streetAddress" required className="border border-gray-300 dark:border-gray-700 pl-3 py-3 shadow-sm rounded bg-transparent text-sm focus:outline-none focus:border-indigo-700 placeholder-gray-500 text-gray-600 dark:text-gray-400" placeholder="" />
                            </div> */}
                            {/* 소셜로그인 */}
                            <MemberDetailInputForm label="소셜로그인" id="socialLoginType" inputType="text" value={socialLoginType} onChange={setSocialLoginType} disabled={true}/>
                        </div> 
                        <div>
                            {/* 권한 */}
                            <label htmlFor="authRole" className="pb-2 text-sm font-bold text-gray-800">권한</label>
                            <div className="flex item-start mt-2">
                                <MemberRadioBtn value="회원" onChange={setAuthRole} stateValue={authRole}/>
                                <MemberRadioBtn value="관리자" onChange={setAuthRole} stateValue={authRole}/>
                            </div>
                        </div>
                            {/* <div className="xl:w-1/4 lg:w-1/2 md:w-1/2 flex flex-col mb-6">
                                <label htmlFor="City" className="pb-2 text-sm font-bold text-gray-800">City</label>
                                <div className="border border-gray-300 dark:border-gray-700 shadow-sm rounded flex">
                                    <input tabindex="0" type="text" id="City" name="city" required className="pl-3 py-3 w-full text-sm focus:outline-none border border-transparent focus:border-indigo-700 bg-transparent rounded placeholder-gray-500 text-gray-600 dark:text-gray-400" placeholder="Los Angeles" />
                                    <div className="px-4 flex items-center border-l border-gray-300 dark:border-gray-700 flex-col justify-center text-gray-600 dark:text-gray-400">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="icon icon-tabler icon-tabler-chevron-up" width="16" height="16" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">
                                            <path stroke="none" d="M0 0h24v24H0z" />
                                            <polyline points="6 15 12 9 18 15" />
                                        </svg>
                                        <svg xmlns="http://www.w3.org/2000/svg" className="icon icon-tabler icon-tabler-chevron-down" width="16" height="16" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">
                                            <path stroke="none" d="M0 0h24v24H0z" />
                                            <polyline points="6 9 12 15 18 9" />
                                        </svg>
                                    </div>
                                </div>
                            </div> */}
                            {/* <div className="xl:w-1/4 lg:w-1/2 md:w-1/2 flex flex-col mb-6">
                                <label htmlFor="State/Province" className="pb-2 text-sm font-bold text-gray-800">State/Province</label>
                                <input tabindex="0" type="text" id="State/Province" name="state" required className="border border-gray-300 dark:border-gray-700 pl-3 py-3 shadow-sm bg-transparent rounded text-sm focus:outline-none focus:border-indigo-700 placeholder-gray-500 text-gray-600 dark:text-gray-400" placeholder="California" />
                            </div>
                            <div className="xl:w-1/4 lg:w-1/2 md:w-1/2 flex flex-col mb-6">
                                <label htmlFor="Country" className="pb-2 text-sm font-bold text-gray-800">Country</label>
                                <input tabindex="0" type="text" id="Country" name="country" required className="border bg-transparent border-gray-300 dark:border-gray-700 pl-3 py-3 shadow-sm rounded text-sm focus:outline-none focus:border-indigo-700 placeholder-gray-500 text-gray-600 dark:text-gray-400" placeholder="United States" />
                            </div>
                            <div className="xl:w-1/4 lg:w-1/2 md:w-1/2 flex flex-col mb-6">
                                <div className="flex items-center pb-2">
                                    <label htmlFor="ZIP" className="text-sm font-bold text-gray-800 dark:text-gray-100">ZIP/Postal Code</label>
                                    <div className="ml-2 cursor-pointer text-gray-600 dark:text-gray-400">
                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="16" height="16">
                                            <path className="heroicon-ui" d="M12 22a10 10 0 1 1 0-20 10 10 0 0 1 0 20zm0-2a8 8 0 1 0 0-16 8 8 0 0 0 0 16zm0-9a1 1 0 0 1 1 1v4a1 1 0 0 1-2 0v-4a1 1 0 0 1 1-1zm0-4a1 1 0 1 1 0 2 1 1 0 0 1 0-2z" fill="currentColor" />
                                        </svg>
                                    </div>
                                </div>
                                <input tabindex="0" type="text" name="zip" required id="ZIP" className="bg-transparent border border-red-400 pl-3 py-3 shadow-sm rounded text-sm focus:outline-none focus:border-indigo-700 placeholder-gray-500 text-gray-600 dark:text-gray-400" placeholder="86745" />
                                <div className="flex justify-between items-center pt-1 text-red-700">
                                    <p className="text-xs">Incorrect Zip Code</p>
                                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" className="feather feather-x-circle">
                                        <circle cx="12" cy="12" r="10"></circle>
                                        <line x1="15" y1="9" x2="9" y2="15"></line>
                                        <line x1="9" y1="9" x2="15" y2="15"></line>
                                    </svg>
                                </div>
                            </div> */}
                        {/* </form> */}
                    </div>
                </div>
            </div>
            {/* <div className="container mx-auto mt-10 rounded bg-gray-100 dark:bg-gray-700 w-11/12 xl:w-full">
                <div className="xl:w-full py-5 px-8">
                    <div className="flex items-center mx-auto">
                        <div className="container mx-auto">
                            <div className="mx-auto xl:w-full">
                                <p className="text-lg text-gray-800 dark:text-gray-100 font-bold">Alerts</p>
                                <p className="text-sm text-gray-600 dark:text-gray-400 pt-1">Get updates of any new activity or features. Turn on/off your preferences</p>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="container mx-auto pb-6">
                    <div className="flex items-center pb-4 border-b border-gray-300 dark:border-gray-700 px-8 text-gray-800 dark:text-gray-100">
                        <svg xmlns="http://www.w3.org/2000/svg" className="icon icon-tabler icon-tabler-mail" width="20" height="20" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">
                            <path stroke="none" d="M0 0h24v24H0z" />
                            <rect x="3" y="5" width="18" height="14" rx="2" />
                            <polyline points="3 7 12 13 21 7" />
                        </svg>
                        <p className="text-sm font-bold ml-2 text-gray-800 dark:text-gray-100">Via Email</p>
                    </div>
                    <div className="px-8">
                        <div className="flex justify-between items-center mb-8 mt-4">
                            <div className="w-9/12">
                                <p className="text-sm text-gray-800 dark:text-gray-100 pb-1">Comments</p>
                                <p id="cb1" className="text-sm text-gray-600 dark:text-gray-400">Get notified when a post or comment is made</p>
                            </div>
                            <div className="cursor-pointer rounded-full bg-gray-200 relative shadow-sm">
                                <input tabindex="0" aria-labelledby="cb1" type="checkbox" name="email_comments" id="toggle1" className="focus:outline-none checkbox w-6 h-6 rounded-full bg-white dark:bg-gray-400 absolute shadow-sm appearance-none cursor-pointer border border-transparent top-0 bottom-0 m-auto" />
                                <label className="toggle-label block w-12 h-4 overflow-hidden rounded-full bg-gray-300 dark:bg-gray-800 cursor-pointer"></label>
                            </div>
                        </div>
                        <div className="flex justify-between items-center mb-8">
                            <div className="w-9/12">
                                <p className="text-sm text-gray-800 dark:text-gray-100 pb-1">Job Applications</p>
                                <p id="cb2" className="text-sm text-gray-600 dark:text-gray-400">Get notified when a candidate applies to a job posting</p>
                            </div>
                            <div className="cursor-pointer rounded-full bg-gray-200 relative shadow-sm">
                                <input aria-labelledby="cb2" tabindex="0" type="checkbox" name="email_job_application" id="toggle2" className="focus:outline-none checkbox w-6 h-6 rounded-full bg-white dark:bg-gray-400 absolute shadow-sm appearance-none cursor-pointer border border-transparent top-0 bottom-0 m-auto" />
                                <label className="toggle-label block w-12 h-4 overflow-hidden rounded-full bg-gray-300 dark:bg-gray-800 cursor-pointer"></label>
                            </div>
                        </div>
                        <div className="flex justify-between items-center mb-8">
                            <div className="w-9/12">
                                <p className="text-sm text-gray-800 dark:text-gray-100 pb-1">Product Updates</p>
                                <p id="cb3" className="text-sm text-gray-600 dark:text-gray-400">Get notifitied when there is a new product feature or upgrades</p>
                            </div>
                            <div className="cursor-pointer rounded-full bg-gray-200 relative shadow-sm">
                                <input aria-labelledby="cb3" tabindex="0" type="checkbox" name="email_product_update" id="toggle3" className="focus:outline-none checkbox w-6 h-6 rounded-full bg-white dark:bg-gray-400 absolute shadow-sm appearance-none cursor-pointer border border-transparent top-0 bottom-0 m-auto" />
                                <label className="toggle-label block w-12 h-4 overflow-hidden rounded-full bg-gray-300 dark:bg-gray-800 cursor-pointer"></label>
                            </div>
                        </div>
                    </div>
                    <div className="pb-4 border-b border-gray-300 dark:border-gray-700 px-8">
                        <div className="flex items-center text-gray-800 dark:text-gray-100">
                            <svg xmlns="http://www.w3.org/2000/svg" className="icon icon-tabler icon-tabler-bell" width="20" height="20" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" fill="none" stroke-linecap="round" stroke-linejoin="round">
                                <path stroke="none" d="M0 0h24v24H0z" />
                                <path d="M10 5a2 2 0 0 1 4 0a7 7 0 0 1 4 6v3a4 4 0 0 0 2 3h-16a4 4 0 0 0 2 -3v-3a7 7 0 0 1 4 -6" />
                                <path d="M9 17v1a3 3 0 0 0 6 0v-1" />
                            </svg>
                            <p className="text-sm font-bold ml-2 text-gray-800 dark:text-gray-100">Push Notifications</p>
                        </div>
                    </div>
                    <div className="px-8">
                        <div className="flex justify-between items-center mb-8 mt-4">
                            <div className="w-9/12">
                                <p className="text-sm text-gray-800 dark:text-gray-100 pb-1">Comments</p>
                                <p id="cb4" className="text-sm text-gray-600 dark:text-gray-400">Get notified when a post or comment is made</p>
                            </div>
                            <div className="cursor-pointer rounded-full bg-gray-200 relative shadow-sm">
                                <input aria-labelledby="cb4" tabindex="0" type="checkbox" name="notification_comment" id="toggle4" className="focus:outline-none checkbox w-6 h-6 rounded-full bg-white dark:bg-gray-400 absolute shadow-sm appearance-none cursor-pointer border border-transparent top-0 bottom-0 m-auto" />
                                <label className="toggle-label block w-12 h-4 overflow-hidden rounded-full bg-gray-300 dark:bg-gray-800 cursor-pointer"></label>
                            </div>
                        </div>
                        <div className="flex justify-between items-center mb-8">
                            <div className="w-9/12">
                                <p className="text-sm text-gray-800 dark:text-gray-100 pb-1">Job Applications</p>
                                <p id="cb5" className="text-sm text-gray-600 dark:text-gray-400">Get notified when a candidate applies to a job posting</p>
                            </div>
                            <div className="cursor-pointer rounded-full bg-gray-200 relative shadow-sm">
                                <input aria-labelledby="cb5" tabindex="0" type="checkbox" name="notification_application" id="toggle5" className="focus:outline-none checkbox w-6 h-6 rounded-full bg-white dark:bg-gray-400 absolute shadow-sm appearance-none cursor-pointer border border-transparent top-0 bottom-0 m-auto" />
                                <label className="toggle-label block w-12 h-4 overflow-hidden rounded-full bg-gray-300 dark:bg-gray-800 cursor-pointer"></label>
                            </div>
                        </div>
                        <div className="flex justify-between items-center mb-8">
                            <div className="w-9/12">
                                <p className="text-sm text-gray-800 dark:text-gray-100 pb-1">Product Updates</p>
                                <p id="cb6" className="text-sm text-gray-600 dark:text-gray-400">Get notifitied when there is a new product feature or upgrades</p>
                            </div>
                            <div className="cursor-pointer rounded-full bg-gray-200 relative shadow-sm">
                                <input aria-labelledby="cb6" tabindex="0" type="checkbox" name="notification_updates" id="toggle6" className="focus:outline-none checkbox w-6 h-6 rounded-full bg-white dark:bg-gray-400 absolute shadow-sm appearance-none cursor-pointer border border-transparent top-0 bottom-0 m-auto" />
                                <label className="toggle-label block w-12 h-4 overflow-hidden rounded-full bg-gray-300 dark:bg-gray-800 cursor-pointer"></label>
                            </div>
                        </div>
                    </div>
                </div>
            </div> */}
            <div className="container mx-auto w-11/12 xl:w-full mr-4">
                <div className="w-full py-4 sm:px-0 bg-white flex justify-end">
                    {/* 삭제 */}
                    <MemberDetailBtn btnText="삭제" onClick={onDeleteMember} isEditing={false}/>
                    {/* 수정 */}
                    <MemberDetailBtn btnText="수정" onClick={onMemberEditing}/>
                </div>
            </div> 
        </div>
    );
}

Member.getLayout = (page) => {
    return (
        <DashBoard>
            {page}
        </DashBoard>
    );
}

export default Member;