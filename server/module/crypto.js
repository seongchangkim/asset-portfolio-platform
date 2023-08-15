import crypto from "crypto";

// salting 작업
const createSalt = () => {
    return new Promise((resolve, reject) =>  crypto.randomBytes(64, (err, buf) => {
        if(err) reject(err);

        return resolve(buf.toString("base64"));
    }));
   
};

const cryptoPassword = async (plainPassword, memberSalt = "") => {
    let salt = memberSalt === "" ? await createSalt() : memberSalt;
    return new Promise((resolve, reject) => crypto.pbkdf2(plainPassword, salt, 100000, 64, "sha512", (err, key) => {
        if(err) reject(err);

        // 암호화된 비밀번호를 base64 인코딩형식으로 반환함.
        return resolve({
            encryptedPassword: key.toString("base64"),
            salt
        })
    }));
}

export default  {
    cryptoPassword
}