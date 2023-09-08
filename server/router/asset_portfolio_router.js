// router 
import express from "express";
const router = express.Router();

// mysql 
import mysql from "../mysql/index.js";
import { HttpStatusCode } from "axios";

// 자산 포트폴리오 생성
router.post("/", async (req, res) => {
    const portfolioForm = req.body.portfolio;
    const assetsForm = req.body.assets.map(asset => [asset.asset_name, asset.asset_code, asset.asset_ratio]);

    const portfolioResult = await mysql.baseQuery("createPortfolio", portfolioForm);

    for(let i = 0 ; i< assetsForm.length ; i++){
        assetsForm[i][3] = portfolioResult.insertId;
    }
    
    await mysql.baseQuery("createAssets", [assetsForm]);

    const portfolioInfo = await mysql.baseQuery("getAssetPortfolio", [portfolioResult.insertId]);

    const assets = await mysql.baseQuery("getAssetsByAssetPortId", [portfolioResult.insertId]);
        
    res.status(HttpStatusCode.Created).json({
        success : true,
        portfolioInfo,
        assets
    });
});

router.route("/:asset_port_id")
    // 자산 포트폴리오 수정
    .put(async (req, res) => {
        const portfolioForm = req.body.portfolio;
        const assetsForm = req.body.assets;

        await mysql.baseQuery("updateAssetPortfolio", [portfolioForm.total_amount, portfolioForm.name, req.params.asset_port_id]);

        const assetIds = await mysql.baseQuery("getAssetIdByAssetPortId", [req.params.asset_port_id]);

        for(let i = 0 ; i < assetIds.length ; i++){
            if(i > assetsForm.length-1){
                break;
            }

            await mysql.baseQuery("updateAsset", [assetsForm[i].asset_name, assetsForm[i].asset_code, assetsForm[i].asset_ratio, assetIds[i].asset_id]);
        }

        if(assetIds.length < assetsForm.length){
            assetsForm.splice(0, assetIds.length);
            
            const filteringInputAssets = assetsForm.map((asset) => [asset.asset_name, asset.asset_code, asset.asset_ratio]); 
            for(let i = 0 ; i< filteringInputAssets.length ; i++){
                filteringInputAssets[i][3] = Number(req.params.asset_port_id);
            }
            
            await mysql.baseQuery("createAssets", [filteringInputAssets]);
        }else if(assetIds.length > assetsForm.length){
            for(let i = assetIds.length - 1 ; i >= assetsForm.length ; i--){
                await mysql.baseQuery("deleteAsset", [assetIds[i].asset_id]);
            }
        }
        
        const portfolioInfo = await mysql.baseQuery("getAssetPortfolio", [req.params.asset_port_id]);

        const assets = await mysql.baseQuery("getAssetsByAssetPortId", [req.params.asset_port_id]);

        res.status(HttpStatusCode.Ok).json({
            success: true,
            portfolioInfo, 
            assets
        });
    // 자산 포트폴리오 삭제
    }).delete(async (req, res) => {
        const result = await mysql.baseQuery("deleteAssetPortfolio", [req.params.asset_port_id]);
    
        let success = false;
        if(result.affectedRows === 1){
            success = !success
        }
    
        res.status(success ? HttpStatusCode.Ok : HttpStatusCode.InternalServerError).json({
            success,
            errorMessage: !success ? "관리자와 문의하세요." : undefined
        });
    });

export {
    router as assetPortfolioRouter
}   