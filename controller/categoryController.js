const conn = require("../db");
const { StatusCodes } = require("http-status-codes");

const allReadCategory = async (req, res) => {
    let sql = "SELECT * FROM CATEGORIES_TB";

    try {
        let [results, fields] = await conn.query(sql);

        if (results.length) {
            return res.status(StatusCodes.OK).json(results);
        } else {
            return res.status(StatusCodes.NOT_FOUND).end();
        }
    } catch (error) {
        console.error("Error reading category list:", error);

        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).end();
    }
}

module.exports = allReadCategory;