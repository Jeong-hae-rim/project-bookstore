import conn from "@db/index";
import { GetBooks, Getpagination } from "@model/books";

export async function getLikeCountSql(): Promise<string> {
    return "SELECT count(*) FROM LIKES_TB WHERE liked_book_id = BOOKS_TB.id";
}

export async function getAllBook(
    limit: string,
    currentPage: string,
    categoryId?: string,
    recent?: string,
): Promise<Array<GetBooks>> {
    try {
        let likeSql: string = await getLikeCountSql();
        let sql: string;

        if (categoryId && recent) {
            sql = `SELECT *, (${likeSql}) AS likes FROM BOOKS_TB WHERE category_id = ? AND pub_date BETWEEN DATE_SUB(NOW(), INTERVAL 1 MONTH) AND NOW() LIMIT ? OFFSET ?`;
        } else if (recent) {
            sql = `SELECT *, (${likeSql}) AS likes FROM BOOKS_TB WHERE pub_date BETWEEN DATE_SUB(NOW(), INTERVAL 1 MONTH) AND NOW() LIMIT ? OFFSET ?`;
        } else {
            sql = `SELECT *, (${likeSql}) AS likes FROM BOOKS_TB LIMIT ? OFFSET ?`;
        }

        const params = categoryId
            ? [parseInt(categoryId), parseInt(limit), parseInt(currentPage)]
            : [parseInt(limit), parseInt(currentPage)];
        const offset = (parseInt(currentPage) - 1) * parseInt(limit);

        return conn
            .execute(sql, [...params, offset])
            .then((result: any) => result[0]);
    } catch (error) {
        console.error("Error in getAllBook:", error);
        throw error;
    }
}
