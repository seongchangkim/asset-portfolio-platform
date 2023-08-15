import dotenv from "dotenv";

dotenv.config();

const { NEXT_PUBLIC_GOOGLE_CLIENT_ID, NEXT_PUBLIC_GOOGLE_CLIENT_SECRET, NEXT_PUBLIC_GOOGLE_REDIRECT_URL} = process.env;

const googleLoginConfig = {
    client_id : NEXT_PUBLIC_GOOGLE_CLIENT_ID,
    client_secret : NEXT_PUBLIC_GOOGLE_CLIENT_SECRET,
    redirect_url : NEXT_PUBLIC_GOOGLE_REDIRECT_URL
};

export default googleLoginConfig;