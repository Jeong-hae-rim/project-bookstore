import conn from "@db/index";
import { Like } from "@model/like.model";

export async function getLike(
    userId: number,
    likeBookId: number,
): Promise<Like> {
    try {
        let sql =
            "SELECT * FROM LIKES_TB WHERE user_id = ? AND liked_book_id = ?";

        return conn
            .execute(sql, [userId, likeBookId])
            .then((result: any) => result[0][0]);
    } catch (error) {
        console.error("Error in get like service:", error);
        throw error;
    }
}

export async function addLike(
    userId: number,
    likeBookId: number,
): Promise<number> {
    try {
        let sql = "INSERT INTO LIKES_TB (user_id, liked_book_id) VALUES (?, ?)";
        let params = [userId, likeBookId];

        return conn
            .execute(sql, params)
            .then((result: any) => result[0].affectedRows);
    } catch (error) {
        console.error("Error in add like service:", error);
        throw error;
    }
}
