import conn from "@db/index";
import { Book, BookDetail } from "@model/book.model";

export async function getLikeCountSql(): Promise<string> {
    return "SELECT count(*) FROM LIKES_TB WHERE liked_book_id = BOOKS_TB.id";
}

export const getIsLikeSql = async () => {
    return "SELECT EXISTS (SELECT * FROM LIKES_TB WHERE user_id = ? AND liked_book_id = ?)";
};

export async function getAllBook(
    limit: string,
    currentPage: string,
    categoryId?: string,
    recent?: string,
): Promise<Array<Book>> {
    try {
        let likeSql: string = await getLikeCountSql();
        let sql: string = "";

        const params = categoryId ? [parseInt(categoryId)] : [];
        const offset = (parseInt(currentPage) - 1) * parseInt(limit);

        if (categoryId && recent) {
            sql = `SELECT *, (${likeSql}) AS likes FROM BOOKS_TB WHERE category_id = ? AND pub_date BETWEEN DATE_SUB(NOW(), INTERVAL 1 MONTH) AND NOW() LIMIT ? OFFSET ?`;
        } else if (categoryId) {
            sql = `SELECT *, (${likeSql}) AS likes FROM BOOKS_TB WHERE category_id = ? LIMIT ? OFFSET ?`;
        } else if (recent) {
            sql = `SELECT *, (${likeSql}) AS likes FROM BOOKS_TB WHERE pub_date BETWEEN DATE_SUB(NOW(), INTERVAL 1 MONTH) AND NOW() LIMIT ? OFFSET ?`;
        } else {
            sql = `SELECT *, (${likeSql}) AS likes FROM BOOKS_TB LIMIT ? OFFSET ?`;
        }

        return conn
            .execute(sql, [...params, parseInt(limit), offset])
            .then((result: any) => result[0]);
    } catch (error) {
        console.error("Error in getAllBook service:", error);
        throw error;
    }
}

export async function getDetailBook(
    id: number,
    userId?: number,
): Promise<Array<BookDetail>> {
    try {
        let likeSql: string = await getLikeCountSql();
        let isLikeSql: string = await getIsLikeSql();
        let sql: string = "";

        if (userId) {
            sql = `SELECT *, (${likeSql}) AS likes, (${isLikeSql}) AS is_liked FROM BOOKS_TB LEFT JOIN CATEGORIES_TB ON BOOKS_TB.category_id = CATEGORIES_TB.category_id WHERE BOOKS_TB.id = ?`;
        } else {
            sql = `SELECT *, (${likeSql}) AS likes FROM BOOKS_TB LEFT JOIN CATEGORIES_TB ON BOOKS_TB.category_id = CATEGORIES_TB.category_id WHERE BOOKS_TB.id = ?`;
        }

        const params = userId ? [userId, id, id] : [id];

        return conn.execute(sql, params).then((result: any) => result[0]);
    } catch (error) {
        console.error("Error in getDetailBook service:", error);
        throw error;
    }
}
