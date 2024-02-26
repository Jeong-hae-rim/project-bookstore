import conn from "@db/index";
import { User } from "../model/user.model";
import { hashed, salt } from "../utils/createdPassword";

export async function postUserJoin(
    email: string,
    name: string,
    password: string,
): Promise<Array<User>> {
    try {
        const sql =
            "INSERT INTO USERS_TB (email, name, password, salt) VALUES(?, ?, ?, ?)";

        const sqlArr = [email, name, hashed(password), salt];

        return conn.execute(sql, sqlArr).then((result: any) => result[0]);
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
