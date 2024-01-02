const conn = require("../db/mariadb");
const { StatusCodes } = require("http-status-codes");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");

dotenv.config();

const userJoin = (req, res) => {
    if (req.body == {}) {
        return res.status(StatusCodes.BAD_REQUEST).json({
            message: "요청하신 값을 다시 확인해 주세요."
        })
    } else {
        const { email, name, password } = req.body;
        const sql = "INSERT INTO users (email, name, password) VALUES(?, ?, ?)"
        const sqlArr = [email, name, password];

        conn.query(sql, sqlArr, (err, results) => {
            if (err) {
                return res.status(StatusCodes.BAD_REQUEST).json({
                    message: err
                })
            }
            return res.status(StatusCodes.CREATED).json(results);
        });
    }
}

const userLogin = (req, res) => {
    const { email, password } = req.body;

    let sql = "SELECT * FROM users WHERE email = ?";

    conn.query(sql, email, (err, results) => {
        if (err) {
            return res.status(StatusCodes.BAD_REQUEST).json({
                message: err
            })
        }

        loginUser = results[0];

        if (loginUser && loginUser.password == password) {
            const token = jwt.sign({
                email: loginUser.email
            }, process.env.PRIVATE_KEY, {
                expiresIn: '5m',
                issuer: "jeong"
            })

            res.cookie("token", token, {
                httpOnly: true
            })
            console.log(token);

            return res.status(StatusCodes.OK).json(results);
        } else {
            //403: FORBIDDEN (접근 권리 없음)
            //401: UNAUTHORIZED (비인증 상태)
            return res.status(StatusCodes.UNAUTHORIZED).end();
        }
    });
}

const requestPasswordReset = (req, res) => {
    const { email } = req.body;
    let sql = "SELECT * FROM users WHERE email = ?";

    conn.query(sql, email, (err, results) => {
        if (err) {
            return res.status(StatusCodes.BAD_REQUEST).json({
                message: err
            })
        }

        const user = results[0];

        if (user) {
            return res.status(StatusCodes.OK).json({
                email: email
            });
        } else {
            return res.status(StatusCodes.UNAUTHORIZED).end();
        }
    })
}

const passwordReset = (req, res) => {
    const { email, password } = req.body;

    let sql = "UPDATE users SET password = ? WHERE email = ?";
    let values = [password, email];

    conn.query(sql, values, (err, results) => {
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
}

module.exports = {
    userJoin,
    userLogin,
    requestPasswordReset,
    passwordReset
};