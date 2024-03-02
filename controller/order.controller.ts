import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";

import { Authorization } from "@model/user.model";

import { decodedJWT } from "@utils/decodedJTW";

import * as orderService from "@service/order.service";
import { OrderDetail, OrdersDetail } from "@model/order.model";
import { formatData } from "@utils/formatted";
import { Result, validationResult } from "express-validator";

export const readAllOrder = async (req: Request, res: Response) => {
    const authorization = decodedJWT(req, res) as Authorization;

    try {
        if (!authorization) {
            return res
                .status(StatusCodes.FORBIDDEN)
                .json({ message: "로그인이 필요합니다." });
        }

        let orderInfo: OrdersDetail[] = await orderService.getAllOrders(
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
    const id = req.params.id as unknown as number;

    try {
        const result: Result = validationResult(req);

        if (isNaN(id)) {
            console.error("Validation failed: id is not a valid integer");
            return res
                .status(400)
                .send("Validation failed: id is not a valid integer");
        }

        if (result.isEmpty()) {
            let orderDetailInfo: OrderDetail[] =
                await orderService.getOrderDetail(id);
            const formattedResults = orderDetailInfo.map((result) =>
                formatData(result),
            );

            res.status(StatusCodes.OK).json(formattedResults);
        } else {
            return res
                .status(StatusCodes.BAD_REQUEST)
                .json({ message: "요청하는 값을 확인해 주세요." });
        }
    } catch (error) {
        console.error("Error reading orders detail:", error);
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).end();
    }
};
