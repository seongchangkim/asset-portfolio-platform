const jwtConfig = {
    secretKey: "SeCrEtKeY",
    option: {
        algorithm: "HS256",
        expiresIn: "1d",
        issuer: "issuer"
    }
};

export default jwtConfig;