const memberSql = {
    // 회원가입
    "registerMember": "INSERT INTO member SET ?",
    // 회원 id에 다른 조회
    "getMemberById" : "SELECT * FROM member WHERE member_id = ?",
    // 로그인
    "login": "SELECT * FROM member WHERE email = ?",
    // 토큰 수정(로그인)
    "updateMemberToken" : "UPDATE member SET token = ? WHERE member_id = ?",
    // 토큰에 의한 회원 조회(로그인 인증)
    "findMemberByToken" : "SELECT * FROM member WHERE token = ?",
    // 로그아웃(빈 토큰 수정)
    "logout": "UPDATE member SET token = '' WHERE member_id = ?",
    // 프로필 상세보기
    "getProfileInfo" : "SELECT name, profile_url, tel FROM member WHERE member_id = ?",
    // 프로필 수정
    "updateProfile" : "UPDATE member SET name = ?, tel = ?, profile_url = ?, last_modified_at = CURRENT_TIMESTAMP WHERE member_id = ?",
    // 소셜 로그인 회원 존재 여부
    "isSocialLogin" : "SELECT * FROM member WHERE social_login_type = ? AND name = ? AND email = ?",
    // 소셜 로그인
    "socialLogin" : "UPDATE member SET social_login_type = ? WHERE member_id = ?",
    // 회원 id 및 소셜로그인 종류에 의한 토큰 조회
    "getTokenByIdAndKind" : "SELECT * FROM member WHERE member_id = ? AND social_login_type = ?"
}

export default memberSql;

