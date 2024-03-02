import conn from "@db/index";
import { Order, OrderDetail, OrdersDetail } from "@model/order.model";

export async function getAllOrders(
    userId: number,
): Promise<Array<OrdersDetail>> {
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

export async function getOrderDetail(orderId: number): Promise<OrderDetail[]> {
    try {
        let sql: string = `SELECT
        book_id, title, author, price, amount
        FROM ORDERED_BOOKS_TB LEFT JOIN BOOKS_TB ON ORDERED_BOOKS_TB.book_id = BOOKS_TB.id
        WHERE order_id = ?`;

        return conn.execute(sql, [orderId]).then((result: any) => result[0]);
    } catch (error) {
        console.error("Error in get all orders service:", error);
        throw error;
    }
}
