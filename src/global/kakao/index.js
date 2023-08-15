import kakaoLoginConfig from "./config";

export const kakaoInit = () => {
    const kakao = window.Kakao;
    if(!kakao.isInitialized()){
        kakao.init(kakaoLoginConfig.js_public_key);
    }
    
    return kakao;
}
