import conn from "./index";
import { GetBooks, Getpagination } from "../model/books";

export async function getLikeCountSql(): Promise<string> {
    return "SELECT count(*) FROM LIKES_TB WHERE liked_book_id = BOOKS_TB.id";
}

export async function getAllBook(
    limit: string,
    currentPage: string,
): Promise<Array<GetBooks>> {
    try {
        let likeSql: string = await getLikeCountSql();
        let sql: string = `SELECT *, (${likeSql}) AS likes FROM BOOKS_TB LIMIT ? OFFSET ?`;
        let offset = (parseInt(currentPage) - 1) * parseInt(limit);
        return conn
            .execute(sql, [parseInt(limit), offset])
            .then((result: any) => result[0]);
    } catch (error) {
        console.error("Error in getAllBook:", error);
        throw error;
    }
}

export async function getCategoryAndRecent(
    categoryId: string,
    limit: string,
    currentPage: string,
): Promise<Array<GetBooks>> {
    try {
        let likeSql: string = await getLikeCountSql();
        let sql: string = `SELECT *, (${likeSql}) AS likes FROM BOOKS_TB WHERE category_id = ? AND pub_date BETWEEN DATE_SUB(NOW(), INTERVAL 1 MONTH) AND NOW() LIMIT ? OFFSET ?`;
        let offset = (parseInt(currentPage) - 1) * parseInt(limit);

        return conn
            .execute(sql, [parseInt(categoryId), parseInt(limit), offset])
            .then((result: any) => result[0]);
    } catch (error) {
        console.error("Error in getCategoryAndRecent:", error);
        throw error;
    }
}
