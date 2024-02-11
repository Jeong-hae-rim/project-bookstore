import { Request, Response } from "express";
import { GetBooks, Getpagination } from "@model/books";
import * as BookData from "@service/books";
import { formatData } from "@utils/formatted";
import { CATEGORY_ID, RECENT } from "@utils/constants";
import { decodedJWT } from "@utils/decodedJTW";
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
            if (errors[0].path === CATEGORY_ID) {
                bookInfo = await BookData.getAllBook(
                    limit,
                    currentPage,
                    undefined,
                    recent,
                );
            } else if (errors[0].path === RECENT) {
                bookInfo = await BookData.getAllBook(
                    limit,
                    currentPage,
                    categoryId,
                );
            }
        }

        let totalBookCount: Array<{ totalRows: number }> =
            await BookData.getCountPagination();
        let firstRow = totalBookCount[0];

        let paginationInfo: Getpagination = {
            totalCount: firstRow.totalRows,
            currentPage: currentPage,
        };

        const formattedResults = bookInfo.map((result) => formatData(result));

        res.send({
            books: formattedResults,
            pagination: paginationInfo,
        });
    } catch (error) {
        console.error("Error in getAllBook controller:", error);
        res.status(500).send("Internal Server Error");
    }
}

export async function getDetailBook(req: Request, res: Response) {
    const { id } = req.params;
    const authorization = decodedJWT(req, res);

    try {
        console.log(id);
        console.log(authorization);

        res.send({});
    } catch (error) {
        console.error("Error in getDetailBook controller:", error);
        res.status(500).send("Internal Server Error");
    }
}
