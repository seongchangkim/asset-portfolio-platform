const assetPortfolioSql = {
    // 자산 포트폴리오 생성
    "createPortfolio" : "INSERT INTO asset_portfolio SET ?",
    // 등록된 자산 생성
    "createAssets" : "INSERT INTO asset(asset_name, asset_code, asset_ratio, asset_port_id) VALUES ?;",
    // 자산 포트폴리오 id에 의한 자산 포트폴리오 조회
    "getAssetPortfolio" : "SELECT * FROM asset_portfolio WHERE asset_port_id = ?",
    // 자산 포트폴리오 id에 의한 등록된 자산 조회
    "getAssetsByAssetPortId" : "SELECT * FROM asset WHERE asset_port_id = ?",
    // 회원 id에 의한 자산 포트폴리오 조회
    "getAssetPortfolioByMemberId" : "SELECT * FROM asset_portfolio WHERE member_id = ?",
    // 자산 포트폴리오 정보 수정 
    "updateAssetPortfolio" : "UPDATE asset_portfolio SET total_amount = ?, name = ?, last_modified_at = CURRENT_TIMESTAMP WHERE asset_port_id = ?",
    // 자산 포트폴리오 id에 의해 자산 id 조회
    "getAssetIdByAssetPortId" : "SELECT asset_id FROM asset WHERE asset_port_id = ANY(SELECT asset_port_id FROM asset_portfolio WHERE asset_port_id = ?)", 
    // 등록된 자산 정보 수정
    "updateAsset" : "UPDATE asset SET asset_name = ?, asset_code = ?, asset_ratio = ? WHERE asset_id = ?",
    // 등록된 자산 삭제
    "deleteAsset" : "DELETE FROM asset WHERE asset_id = ?",
    // 자산 포트폴리오 삭제
    "deleteAssetPortfolio" : "DELETE FROM asset_portfolio WHERE asset_port_id = ?"
}

export default assetPortfolioSql;