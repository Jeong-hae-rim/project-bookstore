const conn = require("../db");
const { StatusCodes } = require("http-status-codes");

const allReadCategory = async (req, res) => {
    let sql = "SELECT * FROM CATEGORIES_TB";

    try {
        let [results, fields] = await conn.query(sql);

        const formattedResults = results.map(result => ({
            categoryId: result.category_id,
            genre: result.genre
        }));

        if (results.length) {
            return res.status(StatusCodes.OK).json(formattedResults);
        } else {
            return res.status(StatusCodes.NOT_FOUND).end();
        }
    } catch (error) {
        console.error("Error reading category list:", error);

        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).end();
    }
}

module.exports = allReadCategory;