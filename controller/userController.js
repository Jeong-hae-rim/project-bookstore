const conn = require("../db/mariadb");
const { StatusCodes } = require("http-status-codes");

const userJoin = (req, res) => {
    if (req.body == {}) {
        res.status(StatusCodes.BAD_REQUEST).json({
            message: "요청하신 값을 다시 확인해 주세요."
        })
    } else {
        const { email, name, password } = req.body;
        const sql = "INSERT INTO users (email, name, password) VALUES(?, ?, ?)"
        const sqlArr = [email, password, name];

        conn.query(sql, sqlArr, (err, results) => {
            if (err) {
                res.status(StatusCodes.BAD_REQUEST).json({
                    message: err
                })
            }
            res.status(StatusCodes.CREATED).json(results);
        });
    }
}

module.exports = { userJoin };