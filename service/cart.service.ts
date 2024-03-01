import conn from "@db/index";

import { Cart } from "@model/cart.model";

import { createdPlaceHolder } from "@utils/createdPlaceHolder";

//장바구니 리스트 전체 불러오기
export async function getAllCart(userId: number): Promise<Cart[]> {
    try {
        let sql = `SELECT CART_ITEMS_TB.id, book_id, title, summary, amount, price 
                    FROM CART_ITEMS_TB LEFT JOIN BOOKS_TB 
                    ON CART_ITEMS_TB.book_id = BOOKS_TB.id
                    WHERE user_id = ? `;

        return await conn
            .execute(sql, [userId])
            .then((result: any) => result[0]);
    } catch (error) {
        console.error("Error in get all cart service:", error);
        throw error;
    }
}

//장바구니 리스트 선택된 것만 불러오기
export async function getPickCart(
    userId: number,
    selected: number[],
): Promise<Cart[]> {
    try {
        // 선택된 배열의 길이를 기반으로 IN 절에 대한 플레이스홀더 생성
        const placeholders: string = createdPlaceHolder(selected);
        let sql = `SELECT CART_ITEMS_TB.id, book_id, title, summary, amount, price 
                    FROM CART_ITEMS_TB LEFT JOIN BOOKS_TB 
                    ON CART_ITEMS_TB.book_id = BOOKS_TB.id
                    WHERE user_id = ? AND CART_ITEMS_TB.id IN (${placeholders})`;

        return await conn
            .execute(sql, [userId, ...selected])
            .then((result: any) => result[0]);
    } catch (error) {
        console.error("Error in get pick cart service:", error);
        throw error;
    }
}

//장바구니 추가
export async function addCart(
    bookId: number,
    amount: number,
    userId: number,
): Promise<number> {
    try {
        let sql =
            "INSERT INTO CART_ITEMS_TB (book_id, amount, user_id) VALUES (?, ?, ?)";

        return conn
            .execute(sql, [bookId, amount, userId])
            .then((result: any) => result[0].affectedRows);
    } catch (error) {
        console.error("Error in add cart service:", error);
        throw error;
    }
}

//장바구니 리스트 삭제
export async function deleteCarts(
    userId: number,
    items: number[],
): Promise<number | string> {
    try {
        // 선택된 배열의 길이를 기반으로 IN 절에 대한 플레이스홀더 생성
        if (items) {
            const placeholders: string = createdPlaceHolder(items);
            let sql = `DELETE FROM CART_ITEMS_TB WHERE user_id = ? AND book_id IN (${placeholders})`;

            return conn
                .execute(sql, [userId, ...items])
                .then((result: any) => result[0].affectedRows);
        } else {
            return "items가 존재하지 않습니다.";
        }
    } catch (error) {
        console.error("Error in delete carts service:", error);
        throw error;
    }
}
