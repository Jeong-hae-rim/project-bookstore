import mysql from "mysql2";
import dotenv from "dotenv";

dotenv.config();

const dbConfig = JSON.parse(process.env.DB_CONFIG as string);
const pool = mysql.createPool(dbConfig);

const connection = pool.promise();

export default connection;
