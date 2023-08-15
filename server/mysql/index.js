import mysql from "mysql";
import sql from "./sql/index.js";
import dotenv from "dotenv";

dotenv.config();

const { MYSQL_DB_HOST, MYSOL_DB_PORT, MYSQL_DB_USER, MYSQL_DB_PASSWORD, MYSQL_DB_DATABASE, MYSQL_DB_CONNECTION_LIMIT } = process.env;

const connection = mysql.createPool({
    host: MYSQL_DB_HOST,
    port: MYSOL_DB_PORT,
    user: MYSQL_DB_USER,
    password: MYSQL_DB_PASSWORD,
    database: MYSQL_DB_DATABASE,
    connectionLimit: MYSQL_DB_CONNECTION_LIMIT
});

const baseQuery = async (alias, values = "") => {
    return new Promise((resolve, reject) => {
        connection.query(sql[alias], values, (error, results) => {
            if(error){
                reject(error);
            }else{
                resolve(results);
            }
        });
    });
};

const conditionQuery = async (alias, values = "", condition) => {
    let dynamicQuery = sql[alias];
    // 동적 쿼리를 하드 코딩으로 처리(개선 필요)
    if(alias === "getMemberList"){
        dynamicQuery = `${sql[alias].substr(0, sql[alias].indexOf("ORDER"))} WHERE ${condition["category"]} like \"%${condition["keyword"]}%\" ${sql[alias].substr(sql[alias].indexOf("ORDER"))}`;
    }else{
        dynamicQuery = `${sql[alias]} WHERE ${condition["category"]} like \"%${condition["keyword"]}%\"`;
    }

    return new Promise((resolve, reject) => {
        connection.query(dynamicQuery, values, (error, results) => {
            if(error){
                reject(error);
            }else{
                resolve(results);
            }
        });
    });
}

export default  {
    baseQuery,
    conditionQuery
};
