import memberSql from "./member_sql.js";
import adminSql from "./admin_sql.js";
import assetPortfolioSql from "./asset_portfolio_sql.js";

export default  {
    ...memberSql,
    ...adminSql,
    ...assetPortfolioSql
}