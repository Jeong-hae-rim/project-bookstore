const conn = require("../db/mariadb");
const { StatusCodes } = require("http-status-codes");

const allReadCategory = (req, res) => {
    let allReadSql = "SELECT * FROM categories";

    conn.query(allReadSql, (err, results) => {
        if (err) {
            return res.status(StatusCodes.BAD_REQUEST).json({
                message: err
            })
        }

        const categories = results[0];

        if (categories) {
            return res.status(StatusCodes.OK).json(results);
        } else {
            return res.status(StatusCodes.NOT_FOUND).end();
        }
    })
}

module.exports = allReadCategory;