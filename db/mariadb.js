const mysql = require("mysql2");
const dotenv = require("dotenv");

dotenv.config();

const dbConfig = JSON.parse(process.env.DB_CONFIG);
const connection = mysql.createPool(dbConfig);

module.exports = connection.promise();