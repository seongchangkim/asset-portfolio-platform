// express
import express from "express";
const port = 3000;

import dotenv from "dotenv";
dotenv.config();

// 실행 환경
const dev = process.env.NODE_ENV !== "production";

// next.js
import next from "next";
const app = next({dev});
const nextJsRequestHandler = app.getRequestHandler();

// cookie-parser
import cookieParser from "cookie-parser";

// router
import { memberRouter } from "./router/member_router.js";
import { adminRouter } from "./router/admin_router.js";
import { assetPortfolioRouter } from "./router/asset_portfolio_router.js";

app.prepare().then(() => {
    const expressServer = express();

    // POST 방식으로 request 시 json 형태로 받을 수 있도록 허용
    expressServer.use(express.json({
        limit: "50mb"
    }));
        
    // express에서 cookie-parser 사용
    expressServer.use(cookieParser());

    // express 서버에서 이미지 인식
    expressServer.use(express.static("public"));

    expressServer.set("trust proxy", true);
    expressServer.use("/api/member", memberRouter);
    expressServer.use("/api/admin", adminRouter);
    expressServer.use("/api/asset-portfolio", assetPortfolioRouter);
    
    if(nextJsRequestHandler) {
        expressServer.all("*", (req, res) => {
            return nextJsRequestHandler(req, res);
        });
    }

    expressServer.listen(port, () => {
        console.log(`서버가 ${port} 포트로 작동합니다.`);
    });
}).catch((e) => {
    console.error(e);
    process.exit(1);
});
    