import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";
import { Result, validationResult } from "express-validator";

import { Cart } from "@model/cart.model";
import { Authorization } from "@model/user.model";

import { decodedJWT } from "@utils/decodedJTW";
import { formatData } from "@utils/formatted";

import * as cartService from "@service/cart.service";

interface CartProps {
    selected: number[];
}

interface CustomRequest<T> extends Request {
    body: T;
}

export const allReadCartItems = async (
    req: CustomRequest<CartProps>,
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
                .json({ message: "요청하는 값을 확인해 주세요." });
        }
    } catch (error) {
        console.error("Error reading cart lists:", error);

        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).end();
    }
};

interface AddCartProps {
    bookId: number;
    amount: number;
}

interface CustomRequest<T> extends Request {
    body: T;
}

export const addToCarts = async (
    req: CustomRequest<AddCartProps>,
    res: Response,
) => {
    const { bookId, amount } = req.body;
    const authorization = decodedJWT(req, res) as Authorization;

    try {
        const result: Result = validationResult(req);

        if (result.isEmpty()) {
            let addCartResult: number = await cartService.addCart(
                bookId,
                amount,
                authorization.id,
            );

            if (addCartResult === 0) {
                return res.status(StatusCodes.BAD_REQUEST).end();
            } else {
                return res
                    .status(StatusCodes.OK)
                    .json({ message: "성공적으로 데이터가 추가되었습니다." });
            }
        } else {
            return res
                .status(StatusCodes.BAD_REQUEST)
                .json({ message: "요청하는 값을 확인해 주세요." });
        }
    } catch (error) {
        console.error("Error add cart item:", error);

        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).end();
    }
};

export const removeToCart = async (req: Request, res: Response) => {
    const bookIdArr: number[] = req.body.selected;
    const authorization = decodedJWT(req, res) as Authorization;

    try {
        let deleteCartResult: number | string = 0;
        const result: Result = validationResult(req);

        if (result.isEmpty()) {
            if (bookIdArr.length === 0) {
                return res
                    .status(StatusCodes.BAD_REQUEST)
                    .json({ message: "요청하는 값을 확인해 주세요." });
            } else {
                deleteCartResult = await cartService.deleteCarts(
                    authorization.id,
                    bookIdArr,
                );

                if (deleteCartResult === 0) {
                    return res.status(StatusCodes.BAD_REQUEST).end();
                } else {
                    return res
                        .status(StatusCodes.OK)
                        .json({ message: "성공적으로 삭제되었습니다." });
                }
            }
        } else {
            return res
                .status(StatusCodes.BAD_REQUEST)
                .json({ message: "요청하는 값을 확인해 주세요." });
        }
    } catch (error) {
        console.error("Error remove cart item:", error);

        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).end();
    }
};
