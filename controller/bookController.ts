import { Request, Response } from "express";
import { GetBooks, Getpagination } from "../model/books";
import * as BookData from "../db/books";
import { Result, validationResult } from "express-validator";

export async function getAllBook(req: Request, res: Response) {
    const categoryId = req.query.categoryId as string;
    const recent = req.query.recent as string;
    const limit = req.query.limit as string;
    const currentPage = req.query.currentPage as string;

    try {
        const result: Result = validationResult(req);

        let bookInfo: Array<GetBooks>;

        if (result.isEmpty()) {
            bookInfo = await BookData.getCategoryAndRecent(
                categoryId,
                limit,
                currentPage,
            );
        } else {
            bookInfo = await BookData.getAllBook(limit, currentPage);
        }

        res.send(bookInfo);
    } catch (error) {
        console.error("Error in getAllBook controller:", error);
        res.status(500).send("Internal Server Error");
    }
}
