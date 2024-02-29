import { Request, Response } from "express";
import { Result, validationResult } from "express-validator";
import { StatusCodes } from "http-status-codes";
import dotenv from "dotenv";

import * as userService from "@service/user.service";

dotenv.config();

interface UserProps {
    email: string;
    password: string;
    name: string;
}

interface CustomRequest<T> extends Request {
    body: T;
}

export const userJoin = async (
    req: CustomRequest<UserProps>,
    res: Response,
) => {
    const { email, password, name } = req.body;

    try {
        const result: Result = validationResult(req);

        console.log(result);

        if (result.isEmpty()) {
            return await userService
                .postUserJoin(email, name, password)
                .then((user) => res.status(StatusCodes.CREATED).json(user));
        } else {
            return res.status(StatusCodes.BAD_REQUEST).json({
                message: "요청하신 값을 다시 확인해 주세요.",
            });
        }
    } catch (error) {
        console.error("Error join user:", error);

        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).end();
    }
};

export const userLogin = async (
    req: CustomRequest<UserProps>,
    res: Response,
) => {
    const { email, password } = req.body;

    try {
        const result: Result = validationResult(req);
        if (result.isEmpty()) {
            const userData = await userService.postUserLogin(email, password);

            if ("token" in userData) {
                res.cookie("token", userData.token, {
                    httpOnly: true,
                });

                return res.status(StatusCodes.OK).json(userData);
            } else {
                return res.status(StatusCodes.UNAUTHORIZED).end();
            }
        } else {
            return res.status(StatusCodes.BAD_REQUEST).json({
                message: "요청하신 값을 다시 확인해 주세요.",
            });
        }
    } catch (error) {
        console.error("Error user login:", error);

        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).end();
    }
};

export const requestPasswordReset = async (
    req: CustomRequest<UserProps>,
    res: Response,
) => {
    const { email } = req.body;

    try {
        const result: Result = validationResult(req);

        if (result.isEmpty()) {
            return res.status(StatusCodes.OK).json({
                email: email,
            });
        } else {
            return res.status(StatusCodes.UNAUTHORIZED).end();
        }
    } catch (error) {
        console.error("Error password reset request:", error);

        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).end();
    }
};

export const passwordReset = async (
    req: CustomRequest<UserProps>,
    res: Response,
) => {
    const { email, password } = req.body;

    const result: Result = validationResult(req);

    try {
        if (result.isEmpty()) {
            const results: number = await userService.putResetPassword(
                email,
                password,
            );

            if (results === 0) {
                return res.status(StatusCodes.BAD_REQUEST).end();
            } else {
                return res.status(StatusCodes.OK).json(results);
            }
        } else {
            return res.status(StatusCodes.BAD_REQUEST).json({
                message: "요청하신 값을 다시 확인해 주세요.",
            });
        }
    } catch (error) {
        console.error("Error password reset:", error);

        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).end();
    }
};
