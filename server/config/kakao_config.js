import dotenv from "dotenv";

dotenv.config();

const { NEXT_PUBLIC_KAKAO_REST_API_KEY, NEXT_PUBLIC_KAKAO_REDIRECT_URL, NEXT_PUBLIC_KAKAO_JS_PUBLIC_KEY} = process.env;

const kakaoLoginConfig = {
    rest_api_key : NEXT_PUBLIC_KAKAO_REST_API_KEY,
    redirect_url : NEXT_PUBLIC_KAKAO_REDIRECT_URL,
    js_public_key : NEXT_PUBLIC_KAKAO_JS_PUBLIC_KEY
}

export default kakaoLoginConfig;