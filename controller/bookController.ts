import { Request, Response } from "express";
import { GetBooks, Getpagination } from "@model/books";
import * as BookData from "@services/books";
import { Result, validationResult } from "express-validator";

export async function getAllBook(req: Request, res: Response) {
    const categoryId = req.query.categoryId as string;
    const recent = req.query.recent as string;
    const limit = req.query.limit as string;
    const currentPage = req.query.currentPage as string;

    try {
        const result: Result = validationResult(req);
        const errors: Array<{ path: string }> = result.array();

        let bookInfo: Array<GetBooks> = [];

        if (result.isEmpty()) {
            bookInfo = await BookData.getAllBook(
                limit,
                currentPage,
                categoryId,
                recent,
            );
        } else {
            if (errors[0].path === "categoryId") {
                bookInfo = await BookData.getAllBook(
                    limit,
                    currentPage,
                    undefined,
                    recent,
                );
            } else if (errors[0].path === "recent") {
                bookInfo = await BookData.getAllBook(
                    limit,
                    currentPage,
                    categoryId,
                );
            }
        }

        res.send(bookInfo);
    } catch (error) {
        console.error("Error in getAllBook controller:", error);
        res.status(500).send("Internal Server Error");
    }
}
