import { Request, Response } from "express";
import { Result, validationResult } from "express-validator";

import { Book, BookDetail } from "@model/book.model";
import { Pagination } from "@model/pagination.model";

import { formatData } from "@utils/formatted";
import { CATEGORY_ID, RECENT } from "@utils/constants";
import { decodedJWT } from "@utils/decodedJTW";

import * as BookService from "@service/book.service";
import * as PaginationService from "@service/pagination.service";

export async function getAllBook(req: Request, res: Response) {
    const categoryId = req.query.categoryId as string;
    const recent = req.query.recent as string;
    const limit = req.query.limit as string;
    const currentPage = req.query.currentPage as string;

    try {
        const result: Result = validationResult(req);
        const errors: Array<{ path: string }> = result.array();

        let bookInfo: Array<Book> = [];

        if (result.isEmpty()) {
            bookInfo = await BookService.getAllBook(
                limit,
                currentPage,
                categoryId,
                recent,
            );
        } else {
            if (errors[0].path === CATEGORY_ID) {
                bookInfo = await BookService.getAllBook(
                    limit,
                    currentPage,
                    undefined,
                    recent,
                );
            } else if (errors[0].path === RECENT) {
                bookInfo = await BookService.getAllBook(
                    limit,
                    currentPage,
                    categoryId,
                    undefined,
                );
            }
        }

        let totalBookCount: Array<{ totalRows: number }> =
            await PaginationService.getCountPagination();
        let firstRow = totalBookCount[0];

        let paginationInfo: Pagination = {
            totalCount: firstRow.totalRows,
            currentPage: currentPage,
        };

        const formattedResults = bookInfo.map((result) => formatData(result));

        return res.send({
            books: formattedResults,
            pagination: paginationInfo,
        });
    } catch (error) {
        console.error("Error in getAllBook controller:", error);
        return res.status(500).send("Internal Server Error");
    }
}

interface AuthorizationProps {
    id: number;
    email: string;
    iat: number;
    exp: number;
    iss: string;
}

export async function getDetailBook(req: Request, res: Response) {
    const id = req.params.id as unknown as number;
    const authorization = decodedJWT(req, res) as AuthorizationProps;

    console.log(authorization);

    try {
        const result: Result = validationResult(req);

        let bookInfo: BookDetail[] = [];
        let userId = "2";

        if (isNaN(id)) {
            console.error("Validation failed: id is not a valid integer");
            return res
                .status(400)
                .send("Validation failed: id is not a valid integer");
        }

        if (result.isEmpty()) {
            if (!authorization) {
                bookInfo = await BookService.getDetailBook(id, undefined);
            } else {
                bookInfo = await BookService.getDetailBook(
                    id,
                    authorization.id,
                );
            }
            const formattedResults = bookInfo.map((result) =>
                formatData(result),
            );
            return res.send(formattedResults[0]);
        }
    } catch (error) {
        console.error("Error in getDetailBook controller:", error);
        return res.status(500).send("Internal Server Error");
    }
}
