import conn from "@db/index";

export async function getCountPagination(): Promise<
    Array<{ totalRows: number }>
> {
    try {
        let countSql: string = "SELECT COUNT(*) AS totalRows FROM BOOKS_TB";

        return conn.execute(countSql).then((result: any) => result[0]);
    } catch (error) {
        console.error("Error in getCountPage service:", error);
        throw error;
    }
}
