const conn = require("../db/mariadb");
const { StatusCodes } = require("http-status-codes");

const addLike = (req, res) => {
    const { id } = req.params;
    const { user_id } = req.body;

    let sql = "INSERT INTO likes (user_id, liked_book_id) VALUES (?, ?)";

    conn.query(sql, [user_id, parseInt(id)], (err, results) => {
        if (err) {
            return res.status(StatusCodes.BAD_REQUEST).json({
                message: err
            })
        }

        if (results.affectedRows === 0) {
            return res.status(StatusCodes.BAD_REQUEST).end();
        } else {
            return res.status(StatusCodes.OK).json(results);
        }
    })
};

const removeLike = (req, res) => {
    res.json({ message: "좋아요 취소" })
};

module.exports = { addLike, removeLike }