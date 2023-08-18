import { useEffect, useState } from "react";
import { useRouter } from "next/router";
import axios from "axios";

// redux
import { useDispatch, useSelector } from "react-redux";

// Member Store
import { setMemberState, getMemberState } from "@/store/member/member_slice";

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

// 회원 상세보기 버튼 컴포넌트 dynamic import하도록 설정
const MemberDetailBtn = dynamic(() => import("@/components/member/member_detail_btn"), {
    ssr: false
});

const Member = () => {

    const router = useRouter();
    const { push } = router;
    
    // Member 저장소를 가져옴.
    const getMember = useSelector(getMemberState);
    const dispatch = useDispatch();

    const [memberId, setMemberId] = useState(0);
    // 이름
    const [name, setName] = useState("");
    // 전화번호 
    const [tel, setTel] = useState("");
    // 프로필 사진
    const [profileUrl, setProfileUrl] = useState("");
    // file 객체
    const [file, setFile] = useState({});

    const getProfileInfo = async () => {
        if(router.isReady){
            const { id } = router.query;
            setMemberId(id);
            
            const res = await axios.get(`/api/member/${id}`); 
            
            // 회원 이름
            setName(res.data.result.name);
            // 회원 전화번호
            setTel(res.data.result.tel);
            // 회원 프로필 사진
            setProfileUrl(res.data.result.profile_url);
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

    // 프로필 수정
    const onProfileEditing = async () => {
        if(isEmptyObject(file)){
            const params = {
                name, tel, profileUrl
            }
            profileEditingProcess(params);
        }else{
            const mountainsRef = ref(
                fStorage,
                `profiles/${memberId}/${new Date().getTime()}_${file.name}`
            );

            uploadBytes(mountainsRef, file).then(async (snapshot) => {
                const getUploadImageUrl = await getDownloadURL(snapshot.ref);

                const params = {
                    name,
                    tel, 
                    profileUrl : getUploadImageUrl
                };
    
                profileEditingProcess(params);
            });
        }
    }

    // 프로필 수정 공통 부분
    // 프로필 수정 API 호출하여 프로필 수정 성공하면 
    // member 저장소가 수정한 정보로 갱신하여 알림창 띄우고 강제 새로고침
    const profileEditingProcess = async (params) => {
        const res = await axios.patch(
            `/api/member/${memberId}`,
            params
        );

        if(res.data['success']){
            dispatch(setMemberState({
                id: getMember.id,
                email: getMember.email,
                name: params.name,
                profile: params.profileUrl,
                tel: params.tel,
                authRole : getMember.authRole
            }));
            alert("해당 회원 정보가 수정되었습니다.");
            window.location.reload();
        }
    }

    // 회원 삭제
    const onLeaveMember = async () => {
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

            dispatch(setMemberState({}));
            alert("회원 탈퇴되었습니다.");
            push("/member/login"); 
        }
    }

    useEffect(() => {
        getProfileInfo()
    }, [router.isReady]);

    return (
        <div className="bg-white">
            <div className="container mx-auto bg-white mt-10 ml-10 rounded px-4">
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
                        <div className="flex justify-start items-center">
                            {/* 이름 */}
                            <MemberDetailInputForm label="이름" id="name" inputType="text" value={name} onChange={setName}/>
                            {/* 전화번호 */}
                            <MemberDetailInputForm label="전화번호" id="tel" inputType="text" value={tel} onChange={setTel}/>
                        </div>
                    </div>
                </div>
            </div>
            <div className="container mx-auto w-11/12 xl:w-full mr-4">
                <div className="w-full py-4 sm:px-0 bg-white flex justify-end">
                    {/* 삭제 */}
                    <MemberDetailBtn btnText="회원 탈퇴" onClick={onLeaveMember} isEditing={false}/>
                    {/* 수정 */}
                    <MemberDetailBtn btnText="수정" onClick={onProfileEditing}/>
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