import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";

import { Authorization } from "@model/user.model";

import { decodedJWT } from "@utils/decodedJTW";

import * as orderService from "@service/order.service";
import { OrderDetail } from "@model/order.model";
import { formatData } from "@utils/formatted";

export const readAllOrder = async (req: Request, res: Response) => {
    const authorization = decodedJWT(req, res) as Authorization;

    try {
        if (!authorization) {
            return res
                .status(StatusCodes.FORBIDDEN)
                .json({ message: "로그인이 필요합니다." });
        }

        let orderInfo: OrderDetail[] = await orderService.getAllOrders(
            authorization.id,
        );

        const formattedResults = orderInfo.map((result) => formatData(result));

        res.status(StatusCodes.OK).json(formattedResults);
    } catch (error) {
        console.error("Error reading orders:", error);

        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).end();
    }
};

export const addToOrder = async (req: Request, res: Response) => {
    // const { items, delivery, totalAmount, totalPrice, firstBookTitle } =
    //     req.body;
    // const authorization = decodedJWT(req, res);
    // // CART_ITEMS_TB SELECT id 조건절
    // let cartItemSql =
    //     "SELECT book_id, amount FROM CART_ITEMS_TB WHERE id IN (?)";
    // // DELIVERY_TB INSERT (DELIVERY_TB id 있어야 함)
    // let deliverySql =
    //     "INSERT INTO DELIVERY_TB (address, receiver, contact) VALUES (?, ?, ?)";
    // let deliveryValues = [
    //     delivery.address,
    //     delivery.receiver,
    //     delivery.contact,
    // ];
    // // ORDERS_TB INSERT (ORDERS_TB id 있어야 함)
    // let ordersSql = `INSERT INTO ORDERS_TB (book_title, total_amount, total_price, user_id, delivery_id) VALUES (?, ?, ?, ?, ?)`;
    // let ordersValues = [
    //     firstBookTitle,
    //     totalAmount,
    //     totalPrice,
    //     authorization.id,
    // ];
    // // ORDERED_BOOKS_TB INSERT (가장 마지막에 되어야 함)
    // let orderedBooksSql = `INSERT INTO ORDERED_BOOKS_TB (order_id, book_id, amount) VALUES ?`;
    // let orderedBooksValues = [];
    // // 쿼리 실행
    // try {
    //     const [cartItemsResults, fields] = await conn.query(cartItemSql, [
    //         items,
    //     ]);
    //     await errorInsertSQL(cartItemsResults, "cartItemSql", res);
    //     const [deliveryResults, fields2] = await conn.query(
    //         deliverySql,
    //         deliveryValues,
    //     );
    //     await errorInsertSQL(deliveryResults.affectedRows, "deliverySql", res);
    //     const [orderResults, fields3] = await conn.query(ordersSql, [
    //         ...ordersValues,
    //         deliveryResults.insertId,
    //     ]);
    //     await errorInsertSQL(orderResults.affectedRows, "ordersSql", res);
    //     cartItemsResults.forEach((item) => {
    //         orderedBooksValues.push([
    //             orderResults.insertId,
    //             item.book_id,
    //             item.amount,
    //         ]);
    //     });
    //     const [orderedBooksResult, fields4] = await conn.query(
    //         orderedBooksSql,
    //         [orderedBooksValues],
    //     );
    //     await errorInsertSQL(
    //         orderedBooksResult.affectedRows,
    //         "orderedBooksSql",
    //         res,
    //     );
    //     const [cartRemoveResults, fields5] = await removeToCarts(
    //         req,
    //         res,
    //         items,
    //     );
    //     await errorInsertSQL(
    //         cartRemoveResults.affectedRows,
    //         "cartRemoveSql",
    //         res,
    //     );
    //     return res.status(StatusCodes.OK).json({
    //         deliveryResults,
    //         orderResults,
    //         orderedBooksResult,
    //         cartRemoveResults,
    //     });
    // } catch (error) {
    //     console.error("Transaction failed:", error);
    //     return res.status(StatusCodes.INTERNAL_SERVER_ERROR).end();
    // }
};

export const readDetailOrder = async (req: Request, res: Response) => {
    // decodedJWT(req, res);
    // const { id } = req.params;
    // let sql = `SELECT
    // book_id, title, author, price, amount
    // FROM ORDERED_BOOKS_TB LEFT JOIN BOOKS_TB ON ORDERED_BOOKS_TB.book_id = BOOKS_TB.id
    // WHERE order_id = ?`;
    // try {
    //     const [results, fields] = await conn.query(sql, [parseInt(id)]);
    //     const formattedResults = results.map((result) => ({
    //         bookId: result.book_id,
    //         title: result.title,
    //         author: result.author,
    //         price: result.price,
    //         amount: result.amount,
    //     }));
    //     return results !== undefined && results !== null && results.length > 0
    //         ? res.status(StatusCodes.OK).json(formattedResults)
    //         : res.status(StatusCodes.OK).json([]);
    // } catch (error) {
    //     console.error("Error reading orders detail:", error);
    //     return res.status(StatusCodes.INTERNAL_SERVER_ERROR).end();
    // }
};
