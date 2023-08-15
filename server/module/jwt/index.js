import jwt from "jsonwebtoken";
import config from "../../config/jwt_config.js";
import randToken from "rand-token";
import { TOKEN_EXPIRED, TOKEN_INVALID } from "./jwt_status_code.js";

const generateToken = (member) => {
    const payload = {
        member_id: member["member_id"],
        email: member["email"],
        name: member["name"],
        tel: member["tel"],
        profileUrl : member["profile_url"],
        authRole: member["auth_role"],
        socialLoginType: member["social_login_type"]
    };

    return {
        accessToken: jwt.sign(payload, config.secretKey, config.option),
        refreshToken : randToken.uid(256)
    };
}

const vaildateToken = (token) => {
    let result = {};
    jwt.verify(token, config.secretKey, (err, decoded) => {
        if(err){
            // 만료된 로그인 토큰인 경우
            if(err.message === "jwt expired"){
                result.JWTErrorStatus = TOKEN_EXPIRED;
                return;
            // 무효한 로그인 토큰인 경우
            }else {
                result.JWTErrorStatus = TOKEN_INVALID;
                return;
            }
        }
        result = decoded;
    });
    return result;
}

export {
    generateToken,
    vaildateToken
}