import conn from "@db/index";
import { Order, OrderDetail } from "@model/order.model";

export async function getAllOrders(
    userId: number,
): Promise<Array<OrderDetail>> {
    try {
        let sql: string = `SELECT 
        ORDERS_TB.id, created_at, receiver, contact, address, book_title, total_amount, total_price 
        FROM ORDERS_TB LEFT JOIN DELIVERY_TB ON ORDERS_TB.delivery_id = DELIVERY_TB.id WHERE user_id = ?`;

        return conn.execute(sql, [userId]).then((result: any) => result[0]);
    } catch (error) {
        console.error("Error in get all orders service:", error);
        throw error;
    }
}
