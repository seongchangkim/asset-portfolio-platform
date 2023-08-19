import axios from "axios";
import BASE_URL from "./base_url";

const checkMemberStore = async ({member, replace, authPageCategory}) => {
    if(Object.keys(member).length === 0) {
        if(authPageCategory === "관리자"){
            alert("이 페이지는 관리자 전용 페이지입니다.");
        }
        replace("/member/login");
    }else if(authPageCategory === "관리자" 
        && member.authRole !== "관리자") {
        checkMemberProcessFunc({
            id: member.id,
            // 팝업창 띄운 후 로그인 페이지로 이동
            func: () => {
                alert("이 페이지는 관리자 전용 페이지입니다.");
                replace("/member/login");
            }
        });
    }
}

const checkMemberProcessFunc = async ({id, func}) => {
    // 로그아웃 실행 후 성공하면 함수 매개변수 호출하여 실행됨.
    await axios.post(`${BASE_URL}/api/member/logout`, {
        id
    }).then(res => {
        const { success } = res.data;
        if(success){
            func();
        }
    });
}

export default checkMemberStore;