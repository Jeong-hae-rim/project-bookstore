import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { StatusCodes } from "http-status-codes";
import { TokenExpiredError, JsonWebTokenError } from "jsonwebtoken";
import { Request, Response } from "express";

dotenv.config();

export const decodedJWT = (req: Request, res: Response) => {
    try {
        let receivedJWT = req.headers["authorization"];

        if (receivedJWT) {
            return jwt.verify(receivedJWT, process.env.PRIVATE_KEY as string);
        } else {
            return receivedJWT;
        }
    } catch (err) {
        console.error(err);

        if (err instanceof TokenExpiredError) {
            return res.status(StatusCodes.UNAUTHORIZED).json({
                message: "로그인 세션이 만료되었습니다. 다시 로그인해 주세요.",
            });
        }

        if (err instanceof JsonWebTokenError) {
            return res.status(StatusCodes.BAD_REQUEST).json({
                message: "잘못된 토큰입니다.",
            });
        }

        return err;
    }
};
