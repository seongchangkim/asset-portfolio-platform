// router
import express from "express";
const router = express.Router();

// 비밀번호 암호화
import crypto from "../module/crypto.js";

// mysql
import mysql from "../mysql/index.js";

// jwt
import { generateToken, vaildateToken } from "../module/jwt/index.js";
import { HttpStatusCode } from "axios";

// axios
import axios from "axios";

// 카카오 로그인 설정값 
import kakaoLoginConfig from "../config/kakao_config.js";

// 구글 로그인 설정값
import googleLoginConfig from "../config/google_config.js";

// uuid
import { v4 as uuidv4 } from "uuid";

// 회원가입
router.post("/", async (req, res) => {
    const memberForm = req.body;
    let password = req.body.password === undefined ? uuidv4() : req.body.password;
    // 비밀번호 암호화하여 암호화된 비밀번호를 저장함.
    const { encryptedPassword, salt } = await crypto.cryptoPassword(password);
    memberForm["password"] = encryptedPassword;
    memberForm["password_salt"] = salt;

    const result = await mysql.baseQuery("registerMember", memberForm);

    const findMember = await mysql.baseQuery("getMemberById", [result["insertId"]]);
    
    res.status(HttpStatusCode.Created).json({
        success: true,
        result : findMember[0]
    });
});

// 로그인 
router.post("/login", async (req, res) => {
    const findMember = await mysql.baseQuery("login", req.body.email);
    const { encryptedPassword } = await crypto.cryptoPassword(req.body.password, findMember[0].password_salt);
    
    // 이메일이 일치하지 않는 경우
    if(findMember.length === 0){
        res.status(HttpStatusCode.Ok).send({
            "warningMessage": "입력한 이메일이 존재하지 않습니다."
        });
    // 비밀번호가 일치하는 경우
    }else if(findMember[0].password === encryptedPassword){
        try{
            
            const generatedToken = generateToken(findMember[0]);
            const result = await mysql.baseQuery("updateMemberToken", [generatedToken.accessToken, findMember[0].member_id]);
            const {portfolio, assets} = await getEntireAssetPortfolioInfo(findMember[0]);

            if(result["changedRows"] === 1){
                res.cookie("x_auth", generatedToken).status(HttpStatusCode.Ok).json({
                    success: true,
                    member: {
                        id: findMember[0]["member_id"],
                        email: findMember[0]["email"],
                        name: findMember[0]["name"],
                        profileUrl: findMember[0]["profile_url"],
                        tel: findMember[0]["tel"],
                        authRole: findMember[0]["auth_role"],
                        socialLoginType: findMember[0]["social_login_type"],
                        token: generatedToken.accessToken
                    },
                    portfolio,
                    assets
                });
            }else{
                throw new Error("관리자와 문의하세요.");
            }
            
        }catch(error){
            res.status(500).send(error);
        }
        
    // 비밀번호가 일치하지 않는 경우
    }else{
        res.status(200).send({
            "warningMessage": "비밀번호가 일치하지 않습니다."
        });
    }
});

// 로그인 인증
router.get("/auth", async (req, res) => {
    // 쿠키에서 토큰이 없으면 false로 반환함
    if(typeof req.cookies.x_auth === "undefined"){
        console.log("no cookie");
        res.status(HttpStatusCode.Ok).json({
            "isValidateToken": false
        });
    }

    const resultByToken = vaildateToken(req.cookies.x_auth.accessToken);

    if(typeof resultByToken.JWTErrorStatus !== "undefined"){
        let errorMessage = "";
        if(resultByToken === -1){
            errorMessage = "유효하지 않은 토큰입니다.\n 다시 로그인을 해주세요.";
        }else{
            errorMessage = "토큰이 만료가 되었습니다.\n 다시 로그인을 해주세요.";
        }

        res.status(HttpStatusCode.Ok).json({
            "isValidateToken": false,
            errorMessage
        });
    }else{
        const { portfolio, assets } = await getEntireAssetPortfolioInfo(resultByToken);

        res.status(HttpStatusCode.Ok).json({
            member: {
                id : resultByToken.id,
                email : resultByToken.email,
                tel : resultByToken.tel, 
                name : resultByToken.name,
                prorfileUrl : resultByToken.profileUrl,
                authRole : resultByToken.authRole,
                socialLoginType : resultByToken.socialLoginType,
                token: req.cookies.x_auth.accessToken
            },
            portfolio,
            assets,
            isValidateToken : true,
        });
    }
});

// 로그아웃
router.post("/logout", async (req, res) => {
    const result = await mysql.baseQuery("logout", req.body.id);

    try{
        if(result["changedRows"] === 1){
            res.clearCookie("x_auth").status(HttpStatusCode.Ok).json({
                success: true
            });
        }else{
            throw new Error("관리자와 문의하세요.");
        }
    }catch(error){
        res.status(500).send(error);
    } 
});

// 프로필 상세보기
router.get("/:id", async (req, res) => {
    const result = await mysql.baseQuery("getProfileInfo", [req.params.id]);

    res.status(HttpStatusCode.Ok).json({
        result: result[0]
    });
});

// 프로필 수정
router.patch("/:id", async (req, res) => {
    const result = await mysql.baseQuery("updateProfile", [req.body.name, req.body.tel, req.body.profileUrl, req.params.id]);

    let success = false;
    if(result["changedRows"] === 1){
        success = !success;
    }

    res.status(HttpStatusCode.Ok).json({
        success
    });
});

// 소셜 로그인
router.post("/social-login/:socialLoginType", async (req, res) => {
    // 클라이언트에서 인가 코드 요청 받기
    const { authCode, token, name, email } = req.body;
    let nameParam = name ?? "";
    let emailParam = email ?? "";
    let accessToken = token ?? "";

    if(req.params.socialLoginType === "KAKAO"){
        if(authCode !== undefined){
            // 카카오 토큰 받기 API 호출
            const getTokenUrl = `https://kauth.kakao.com/oauth/token?grant_type=authorization_code&client_id=${kakaoLoginConfig.rest_api_key}&redirect_uri=${kakaoLoginConfig.redirect_url}&code=${authCode}`;
    
            const getTokenRes = await axios.post(
                getTokenUrl
            );
    
            const { access_token } = getTokenRes.data;
    
            const { nickname, email } = await kakaoLoginCommonGetProfile(access_token);
    
            nameParam = nickname;
            emailParam = email;
            accessToken = access_token;
        }

    }else if(req.params.socialLoginType === "GOOGLE"){
        if(authCode !== undefined){
            const {
                email, name , access_token
            } = await commonGoogleLogin(authCode);
        
            nameParam = name;
            emailParam = email;
            accessToken = access_token;
        }
    }

    // 소셜 로그인 계정 존재하는지 확인
    const findMemberBySocialLogin = await mysql.baseQuery("isSocialLogin", [req.params.socialLoginType, nameParam, emailParam]);

    // 소셜 로그인 계정이 없으면 
    if(findMemberBySocialLogin.length === 0){
        res.status(HttpStatusCode.Ok).json({
            success: true,
            inputState: {
                name : nameParam,
                email : emailParam,
                type : req.params.socialLoginType,
                token : accessToken
            }
        });   
    // 소셜 로그인 계정이 있으면 
    }else{
        // 로그인
        const loginResult = await mysql.baseQuery("login", [emailParam]);
        // 토큰 갱신
        const updateTokenResult = await mysql.baseQuery("updateMemberToken", [accessToken, findMemberBySocialLogin[0]["member_id"]]);
        // 소셜 로그인 유형 갱신
        const updateSocialLoginResult = await mysql.baseQuery("socialLogin", [req.params.socialLoginType, findMemberBySocialLogin[0]["member_id"]]);

        let success = false;

        if((updateTokenResult["changedRows"] === 1 && updateSocialLoginResult["changedRows"] === 1) || updateSocialLoginResult["affectedRows"] === 1){
            success = !success;
        }

        const {portfolio, assets} = await getEntireAssetPortfolioInfo(loginResult[0]);

        res.cookie("x_auth", accessToken).status(HttpStatusCode.Ok).json({
            success,
            member : loginResult[0],
            portfolio,
            assets
        });
    }
});

// 프로필 정보 가져오기(카카오 로그인 공통 처리 부분)
const kakaoLoginCommonGetProfile = async (token) => {
    const getKakaoProfileFromKakaoRes = await axios.get("https://kapi.kakao.com/v2/user/me",{
        headers: {
            Authorization: `Bearer ${token}`,
        }
    });

    const {  
        properties: { nickname },
        kakao_account : { email }
    } = getKakaoProfileFromKakaoRes.data;

    return {
        nickname, email
    };
}

// 토큰 가져오기(idToken 포함) 및 프로필 정보 가져오기(카카오 로그인 공통 처리 부분)
const commonGoogleLogin = async (authCode = "") => {

    const getTokenRes = await axios.post(
        'https://oauth2.googleapis.com/token',{
            code: authCode,
            client_id: googleLoginConfig.client_id,
            client_secret: googleLoginConfig.client_secret,
            redirect_uri: googleLoginConfig.redirect_url,
            grant_type: 'authorization_code'
        }
    );
    
    const { access_token, id_token } = getTokenRes.data;

    const getGoogleProfileRes = await axios.post(`https://oauth2.googleapis.com/tokeninfo?id_token=${id_token}`);
            
    const {
        email, name 
    } = getGoogleProfileRes.data;

    return {
        email, name, access_token
    };
}

router.get("/social-login/auth/:socialLoginType/:id", async (req, res) => {
    const findMember = await mysql.baseQuery("getTokenByIdAndKind", [req.params.id, req.params.socialLoginType]);

    const { portfolio, assets } = await getEntireAssetPortfolioInfo(req.params.id);

    if(findMember !== undefined){
        res.status(HttpStatusCode.Ok).json({
            member: {
                id : findMember[0].member_id,
                email : findMember[0].email,
                tel : findMember[0].tel, 
                name : findMember[0].name,
                prorfileUrl : findMember[0].profile_url,
                authRole : findMember[0].auth_role,
                socialLoginType : findMember[0].social_login_type, 
                token: findMember[0].token
            },
            portfolio,
            assets,
            isValidateToken : true
        });
    }else{
        res.status(HttpStatusCode.Ok).json({
            isValidateToken : false
        });
    }
});

// 로그인 및 로그인 인증 공통 처리 함수 : 자산 포트폴리오 정보 및 등록된 자산 목록 가져오기
const getEntireAssetPortfolioInfo = async (member) => {
    const portfolio = await mysql.baseQuery("getAssetPortfolioByMemberId", [member.member_id]);
    
    const assets = await mysql.baseQuery("getAssetsByAssetPortId", [portfolio.length > 0 ? portfolio[0].asset_port_id : 0]);

    return {
        portfolio: portfolio[0],
        assets
    }
}

export {
    router as memberRouter
};