import conn from "@db/index";

import { Cart } from "@model/cart.model";

import { createdPlaceHolder } from "@utils/createdPlaceHolder";

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
