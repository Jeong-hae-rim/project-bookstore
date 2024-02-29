import { Request, Response } from "express";
import { StatusCodes } from "http-status-codes";

import { decodedJWT } from "@utils/decodedJTW";
import * as likeService from "@service/like.service";
import { Like } from "@model/like.model";
import { AuthorizationProps } from "./book.controller";
import { Result, validationResult } from "express-validator";

export const addLike = async (req: Request, res: Response) => {
    const id = req.params.id as unknown as number;
    const authorization = decodedJWT(req, res) as AuthorizationProps;

    try {
        const result: Result = validationResult(req);

        if (isNaN(id)) {
            console.error("Validation failed: id is not a valid integer");
            return res
                .status(400)
                .send("Validation failed: id is not a valid integer");
        }

        if (result.isEmpty()) {
            const getResults: Like = await likeService.getLike(
                authorization.id,
                id,
            );

            if (!getResults) {
                const results: number = await likeService.addLike(
                    authorization.id,
                    id,
                );

                if (results === 0) {
                    return res.status(StatusCodes.BAD_REQUEST).end();
                } else {
                    return res.status(StatusCodes.OK).json(results);
                }
            }

            return res.status(StatusCodes.CONFLICT).end();
        }
    } catch (error) {
        console.error("Error add like:", error);

        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).end();
    }
};

export const removeLike = async (req: Request, res: Response) => {
    const id = req.params.id as unknown as number;
    const authorization = decodedJWT(req, res) as AuthorizationProps;

    try {
        const result: Result = validationResult(req);

        if (isNaN(id)) {
            console.error("Validation failed: id is not a valid integer");
            return res
                .status(400)
                .send("Validation failed: id is not a valid integer");
        }

        if (result.isEmpty()) {
            const results: number = await likeService.removeLike(
                authorization.id,
                id,
            );

            if (results === 0) {
                return res.status(StatusCodes.BAD_REQUEST).end();
            } else {
                return res.status(StatusCodes.OK).json(results);
            }
        }
    } catch (error) {
        console.error("Error remove like:", error);

        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).end();
    }
};
