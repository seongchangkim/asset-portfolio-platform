// router
import express from "express";
const router = express.Router();

// mysql
import mysql from "../mysql/index.js";

import { HttpStatusCode } from "axios";

// multer 
// 파일 업로드 
import path from "path";
import multer from "multer";
const memoryStorage = multer.memoryStorage({
    filename: function(req, file, cb){
        cb(null, new Date.valueOf() + path.extname(file.originalname));
    }
});
const upload = multer({storage: memoryStorage});

// 회원 목록 API
router.get("/members", async (req, res) => {
    const page = req.query.page === undefined ? 1 : req.query.page;
    // 해당 페이지 시작 인덱스
    const start = (page - 1) * 10; 
    // 해당 페이지 마지막 인덱스
    const end = page * 10;

    // 리펙토링 작업 필요
    if(req.query.category === undefined && req.query.keyword === undefined){
        const result = await mysql.baseQuery("getMemberList", [start, end]);

        // 회원 총 갯수에 대한 쿼리문 호출하여 총 갯수를 구함
        const totalResult = await mysql.baseQuery("getTotalMember");

        // 마지막 페이지 구하기 
        const lastPage = pagingProcessLogic(totalResult[0].totalMember, page);

        res.status(HttpStatusCode.Ok).json({
            result,
            currentPage : typeof page === "string" ? Number(page) : page,
            lastPage
        });
    } else {
        const condition = {
            category : req.query.category,
            keyword : req.query.keyword
        };

        // 회원 총 갯수에 대한 쿼리문 호출하여 총 갯수를 구함
        const totalResult = await mysql.conditionQuery("getTotalMember", [], condition);

        // 마지막 페이지 구하기 
        const lastPage = pagingProcessLogic(totalResult[0].totalMember, page);

        const result = await mysql.conditionQuery("getMemberList", [start, end], condition);
        res.status(HttpStatusCode.Ok).json({
            result,
            currentPage : typeof page === "string" ? Number(page) : page,
            lastPage
        });
    }
});

// 회원 목록 API 공통 로직 : 페이징 처리 계산
const pagingProcessLogic = (totalCount, page) => {
    // 총 페이지
    const totalPage = Math.ceil(totalCount / 10);
        
    // 마지막 페이지
    let lastPage = Math.ceil(page / 10) * 10;

    // 마지막 페이지가 총 페이지보다 작으면 마지막 페이지가 총 페이지가 됨.
    if(totalPage < lastPage){
        lastPage = totalPage;
    }

    // 마지막 페이지 반환
    return lastPage;
}

router.route("/member/:id")
    // 회원 상세보기 API
    .get(async (req, res) => {
        const result = await mysql.baseQuery("getMember", req.params.id);
        res.status(HttpStatusCode.Ok).json({
            result
        });
    // 회원 수정 API
    })
    .patch(upload.single("profile_img"), async (req, res) => {
        const result = await mysql.baseQuery("updateMember", [req.body.name, req.body.email, req.body.tel, req.body.authRole, req.body.profileUrl, req.params.id]);
    
        let success = false;
        if(result["changedRows"] === 1){
            success = !success;
        }

        res.status(HttpStatusCode.Ok).json({
            success
        });
    // 회원 삭제 및 회원 탈퇴 API
    }).delete(async (req, res) => {
        const result = await mysql.baseQuery("leaveMember", [req.params.id]);
    
        let isSucess = false;
        if(result["affectedRows"] === 1){
            isSucess = !isSucess
        }
    
        res.status(HttpStatusCode.Ok).json({
            success: isSucess
        });
    });

export {
    router as adminRouter
};