import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { Result, validationResult } from "express-validator";

import { Cart } from "@model/cart.model";
import { Authorization } from "@model/user.model";

import { decodedJWT } from "@utils/decodedJTW";
import { formatData } from "@utils/formatted";

import * as cartService from "@service/cart.service";

interface UserProps {
    selected: number[];
}

interface CustomRequest<T> extends Request {
    body: T;
}

export const allReadCartItems = async (
    req: CustomRequest<UserProps>,
    res: Response,
) => {
    const { selected } = req.body;
    const authorization = decodedJWT(req, res) as Authorization;

    try {
        let cartInfo: Cart[] = [];
        const result: Result = validationResult(req);

        if (result.isEmpty()) {
            if (selected.length === 0) {
                cartInfo = await cartService.getAllCart(authorization.id);
            } else {
                cartInfo = await cartService.getPickCart(
                    authorization.id,
                    selected,
                );
            }

            const formattedResults = cartInfo.map((result) =>
                formatData(result),
            );

            return res.status(StatusCodes.OK).json(formattedResults);
        } else {
            return res
                .status(StatusCodes.BAD_REQUEST)
                .json("요청하는 값을 확인해 주세요.");
        }
    } catch (error) {
        console.error("Error reading cart lists:", error);

        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).end();
    }
};

// export const addToCarts = async (req, res) => {
//     const { bookId, amount } = req.body;
//     const decoded = decodedJWT(req, res);

//     let sql =
//         "INSERT INTO CART_ITEMS_TB (book_id, amount, user_id) VALUES (?, ?, ?)";

//     try {
//         let [results, fields] = await conn.query(sql, [
//             parseInt(bookId),
//             parseInt(amount),
//             decoded.id,
//         ]);

//         if (results.affectedRows === 0) {
//             return res.status(StatusCodes.BAD_REQUEST).end();
//         } else {
//             return res.status(StatusCodes.OK).json(results);
//         }
//     } catch (error) {
//         console.error("Error add cart item:", error);

//         return res.status(StatusCodes.INTERNAL_SERVER_ERROR).end();
//     }
// };

//id 단일로 들어올 때와 items(배열)이 들어올 때 두 경우를 나누어 처리
// export const removeToCarts = async (req, res, items) => {
//     const { id } = req.params;
//     decodedJWT(req, res);

//     let sql = "";
//     let value = [];

//     try {
//         if (id) {
//             sql = "DELETE FROM CART_ITEMS_TB WHERE id = ?";
//             value = [parseInt(id)];

//             let [results, fields] = await conn.query(sql, value);

//             if (results.affectedRows === 0) {
//                 return res.status(StatusCodes.BAD_REQUEST).end();
//             } else {
//                 return res.status(StatusCodes.OK).json(results);
//             }
//         } else {
//             sql = "DELETE FROM CART_ITEMS_TB WHERE id IN (?)";
//             value = [items];

//             return await conn.query(sql, value);
//         }
//     } catch (error) {
//         console.error("Error remove cart item:", error);

//         return res.status(StatusCodes.INTERNAL_SERVER_ERROR).end();
//     }
// };
