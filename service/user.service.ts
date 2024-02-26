import conn from "@db/index";
import { User } from "../model/user.model";
import { hashed, pwdHashed, salt } from "../utils/createdPassword";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

export async function postUserJoin(
    email: string,
    name: string,
    password: string,
): Promise<Array<User>> {
    try {
        const sql =
            "INSERT INTO USERS_TB (email, name, password, salt) VALUES(?, ?, ?, ?)";

        const params = [email, name, hashed(password), salt];

        return conn.execute(sql, params).then((result: any) => result[0]);
    } catch (error) {
        console.error("Error in user join service:", error);
        throw error;
    }
}

export async function postUserLogin(
    inputEmail: string,
    inputPassword: string,
): Promise<User[] | { result: User[]; token: string }> {
    try {
        let sql = "SELECT * FROM USERS_TB WHERE email = ?";
        const params = [inputEmail];

        return conn.execute(sql, params).then(async (result: any) => {
            const { salt, password } = result[0][0];

            if (result && result[0] && salt) {
                const passwordCheck = pwdHashed(inputPassword, salt);
                let token = "";

                if (password === passwordCheck) {
                    token = jwt.sign(
                        {
                            id: result[0][0].id,
                            email: result[0][0].email,
                        },
                        process.env.PRIVATE_KEY as string,
                        {
                            expiresIn: "1d",
                            issuer: "jeong",
                        },
                    );

                    return { result: result[0] as User[], token };
                } else {
                    return []; // or handle the case where login fails
                }
            } else {
                return []; // or handle the case where result[0] or result[0].salt is undefined
            }
        });
    } catch (error) {
        console.error("Error in user join service:", error);
        throw error;
    }
}

export async function postResetPasswordRequest(
    email: string,
): Promise<Array<User>> {
    try {
        let sql = "SELECT * FROM USERS_TB WHERE email = ?";
        const sqlArr = [email];

        return conn.execute(sql, sqlArr).then((result: any) => result[0]);
    } catch (error) {
        console.error("Error in reset password request service:", error);
        throw error;
    }
}

export async function putResetPassword(
    email: string,
    password: string,
): Promise<number> {
    try {
        let sql = "UPDATE USERS_TB SET password = ?, salt = ? WHERE email = ?";
        let params = [hashed(password), salt, email];

        return conn
            .execute(sql, params)
            .then((result: any) => result[0].affectedRows);
    } catch (error) {
        console.error("Error in reset password service:", error);
        throw error;
    }
}
