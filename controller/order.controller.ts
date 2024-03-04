import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { Result, validationResult } from "express-validator";

import { Authorization } from "@model/user.model";
import { Delivery, OrderDetail, OrdersDetail } from "@model/order.model";
import { Cart } from "@model/cart.model";

import { decodedJWT } from "@utils/decodedJTW";
import { formatData } from "@utils/formatted";

import * as orderService from "@service/order.service";
import * as cartService from "@service/cart.service";

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

interface OrderProps {
    items: number[];
    totalAmount: number;
    totalPrice: number;
    firstBookTitle: string;
    delivery: Omit<Delivery, "id">;
}

interface CustomRequest<T> extends Request {
    body: T;
}

export const addToOrder = async (
    req: CustomRequest<OrderProps>,
    res: Response,
) => {
    const { items, delivery, totalAmount, totalPrice, firstBookTitle } =
        req.body;
    const authorization = decodedJWT(req, res) as Authorization;

    try {
        const result: Result = validationResult(req);

        let cartInfo: Cart[] = await orderService.getCartInfo(items);
        let deliveryInsertId: number = 0;
        let orderInsertId: number = 0;
        let orderedBooksValues: number[][] = [];
        let orderedBooksResult: number = 0;
        let removeCartsResult: number = 0;

        if (!result.isEmpty()) {
            return res
                .status(StatusCodes.BAD_REQUEST)
                .json({ message: "요청하는 값을 확인해 주세요." });
        } else {
            if (cartInfo) {
                deliveryInsertId = await orderService.addToDelivery(
                    delivery.address,
                    delivery.receiver,
                    delivery.contact,
                );
            }

            if (deliveryInsertId) {
                orderInsertId = await orderService.addToOrders(
                    firstBookTitle,
                    totalAmount,
                    totalPrice,
                    authorization.id,
                    deliveryInsertId,
                );

                cartInfo.forEach((item) => {
                    return orderedBooksValues.push([
                        orderInsertId,
                        item.book_id,
                        item.amount,
                    ]);
                });
            }

            if (orderedBooksValues) {
                orderedBooksResult =
                    await orderService.addToOrderedBook(orderedBooksValues);
            }

            if (orderedBooksResult) {
                removeCartsResult = await cartService.deletePickCart(items);
            }

            return res.status(StatusCodes.OK).json(removeCartsResult);
        }
    } catch (error) {
        console.error("Error add cart controller:", error);
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).end();
    }
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
