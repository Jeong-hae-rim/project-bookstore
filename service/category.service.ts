import conn from "@db/index";
import { Category } from "@model/category.model";

export async function getCategory(): Promise<Array<Category>> {
    try {
        let sql = "SELECT * FROM CATEGORIES_TB";

        return conn.execute(sql).then((result: any) => result[0]);
    } catch (error) {
        console.error("Error in getCategory service:", error);
        throw error;
    }
}
