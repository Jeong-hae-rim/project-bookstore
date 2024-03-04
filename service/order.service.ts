import conn from "@db/index";
import { Cart } from "@model/cart.model";
import { Order, OrderDetail, OrdersDetail } from "@model/order.model";
import { createdPlaceHolder } from "@utils/createdPlaceHolder";

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

//주문하기 service

//1. 장바구니에 해당 품목이 있는지 확인
export async function getCartInfo(items: number[]): Promise<Array<Cart>> {
    try {
        const placeholders: string = createdPlaceHolder(items);
        let sql: string = `SELECT book_id, amount FROM CART_ITEMS_TB WHERE id IN (${placeholders})`;

        return conn.execute(sql, [...items]).then((result: any) => result[0]);
    } catch (error) {
        console.error("Error in order in cart info service:", error);
        throw error;
    }
}

// 2. 주소 테이블에 Insert
export async function addToDelivery(
    address: string,
    receiver: string,
    contact: string,
): Promise<number> {
    try {
        let sql =
            "INSERT INTO DELIVERY_TB (address, receiver, contact) VALUES (?, ?, ?)";

        return conn
            .execute(sql, [address, receiver, contact])
            .then((result: any) => result[0].insertId);
    } catch (error) {
        console.error("Error in add delivery service:", error);
        throw error;
    }
}

// 3. 주문 테이블에 Insert
export async function addToOrders(
    book_title: string,
    total_amount: number,
    total_price: number,
    user_id: number,
    delivery_insert_id: number,
): Promise<number> {
    try {
        let sql = `INSERT INTO ORDERS_TB (book_title, total_amount, total_price, user_id, delivery_id) VALUES (?, ?, ?, ?, ?)`;

        return conn
            .execute(sql, [
                book_title,
                total_amount,
                total_price,
                user_id,
                delivery_insert_id,
            ])
            .then((result: any) => result[0].insertId);
    } catch (error) {
        console.error("Error in add order service:", error);
        throw error;
    }
}

// 4. 주문된 책 테이블에 Insert
export async function addToOrderedBook(
    orderedBooksValues: number[][],
): Promise<number> {
    try {
        const values = orderedBooksValues
            .map((value) => `(${value.join(",")})`)
            .join(",");

        let sql = `INSERT INTO ORDERED_BOOKS_TB (order_id, book_id, amount) VALUES ${values}`;

        return conn.execute(sql).then((result: any) => result[0].affectedRows);
    } catch (error) {
        console.error("Error in add order service:", error);
        throw error;
    }
}
