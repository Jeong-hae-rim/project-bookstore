const conn = require("../db/mariadb");
const { StatusCodes } = require("http-status-codes");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv");
const crypto = require("crypto");

dotenv.config();

const userJoin = async (req, res) => {
    const { email, name, password } = req.body;
    const salt = crypto.randomBytes(10).toString('base64');
    const hashed = crypto.pbkdf2Sync(password, salt, 10000, 10, 'sha512').toString('base64');
    const sql = "INSERT INTO USERS_TB (email, name, password, salt) VALUES(?, ?, ?, ?)"
    const sqlArr = [email, name, hashed, salt];

    if (req.body == {}) {
        return res.status(StatusCodes.BAD_REQUEST).json({
            message: "요청하신 값을 다시 확인해 주세요."
        })
    } else {

        let [results, fields] = await conn.query(sql, sqlArr);

        return res.status(StatusCodes.CREATED).json(results);
    }
}

const userLogin = async (req, res) => {
    const { email, password } = req.body;
    let sql = "SELECT * FROM USERS_TB WHERE email = ?";

    let [results, fields] = await conn.query(sql, email);

    const pwdHashed = crypto.pbkdf2Sync(password, results[0].salt, 10000, 10, 'sha512').toString('base64');

    if (results[0] && results[0].password == pwdHashed) {
        const token = jwt.sign({
            id: results[0].id,
            email: results[0].email
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
}

const requestPasswordReset = async (req, res) => {
    const { email } = req.body;
    let sql = "SELECT * FROM USERS_TB WHERE email = ?";

    let [results, fields] = await conn.query(sql, email);

    if (results[0]) {
        return res.status(StatusCodes.OK).json({
            email: email
        });
    } else {
        return res.status(StatusCodes.UNAUTHORIZED).end();
    }
}

const passwordReset = async (req, res) => {
    const { email, password } = req.body;

    const salt = crypto.randomBytes(10).toString('base64');
    const hashed = crypto.pbkdf2Sync(password, salt, 10000, 10, 'sha512').toString('base64');

    let sql = "UPDATE USERS_TB SET password = ?, salt = ? WHERE email = ?";
    let values = [hashed, salt, email];

    let [results, fields] = await conn.query(sql, values);

    if (results.affectedRows === 0) {
        return res.status(StatusCodes.BAD_REQUEST).end();
    } else {
        return res.status(StatusCodes.OK).json(results);
    }
}

module.exports = {
    userJoin,
    userLogin,
    requestPasswordReset,
    passwordReset
};