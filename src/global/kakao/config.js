import dotenv from "dotenv";
dotenv.config();

const kakaoLoginConfig = {
    rest_api_key : process.env.NEXT_PUBLIC_KAKAO_REST_API_KEY,
    redirect_url : process.env.NEXT_PUBLIC_KAKAO_REDIRECT_URL,
    js_public_key : process.env.NEXT_PUBLIC_KAKAO_JS_PUBLIC_KEY
}

export default kakaoLoginConfig;