const adminSql = {
    // 회원 목록 조회
    "getMemberList" : "SELECT member_id, name, email, profile_url, tel, social_login_type, auth_role, created_at, last_modified_at FROM member ORDER BY member_id DESC LIMIT ?, ?",
    // 회원 총 갯수
    "getTotalMember" : "SELECT COUNT(*) AS totalMember FROM member",
    // 회원 상세보기
    "getMember" : "SELECT name, email, profile_url, tel, social_login_type, auth_role FROM member WHERE member_id = ?",
    // 회원 수정
    "updateMember" : "UPDATE member SET name = ?, email = ?, tel = ?, auth_role = ?, profile_url = ?, last_modified_at = CURRENT_TIMESTAMP WHERE member_id = ?",
    // 회원 탈퇴 및 삭제
    "leaveMember" : "DELETE FROM member WHERE member_id = ?" 
};

export default adminSql;