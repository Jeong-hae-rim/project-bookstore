const conn = require("../db/mariadb");
const { StatusCodes } = require("http-status-codes");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");

dotenv.config();

const userJoin = (req, res) => {
    if (req.body == {}) {
        res.status(StatusCodes.BAD_REQUEST).json({
            message: "요청하신 값을 다시 확인해 주세요."
        })
    } else {
        const { email, name, password } = req.body;
        const sql = "INSERT INTO users (email, name, password) VALUES(?, ?, ?)"
        const sqlArr = [email, name, password];

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

const userLogin = (req, res) => {
    const { email, password } = req.body;

    let sql = "SELECT * FROM users WHERE email = ?";

    conn.query(sql, email, (err, results) => {
        if (err) {
            res.status(StatusCodes.BAD_REQUEST).json({
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
    res.json({ message: "비밀 번호 초기화 요청" })
}

const passwordReset = (req, res) => {
    res.json({ message: "비밀 번호 초기화" })
}

module.exports = {
    userJoin,
    userLogin,
    requestPasswordReset,
    passwordReset
};