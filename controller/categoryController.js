const conn = require("../db");
const { StatusCodes } = require("http-status-codes");

const allReadCategory = async (req, res) => {
    let sql = "SELECT * FROM CATEGORIES_TB";

    let [results, fields] = await conn.query(sql);

    if (results[0]) {
        return res.status(StatusCodes.OK).json(results);
    } else {
        return res.status(StatusCodes.NOT_FOUND).end();
    }
}

module.exports = allReadCategory;