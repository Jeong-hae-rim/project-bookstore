import { Request, Response } from "express";
const { StatusCodes } = require("http-status-codes");

import { Category } from "@model/category.model";
import * as CategoryService from "@service/category.service";

import { formatData } from "@utils/formatted";

export const allReadCategory = async (req: Request, res: Response) => {
    try {
        let category: Array<Category> = await CategoryService.getCategory();

        const formattedResults = category.map((result) => formatData(result));

        if (formattedResults.length) {
            return res.status(StatusCodes.OK).json(formattedResults);
        } else {
            return res.status(StatusCodes.NOT_FOUND).end();
        }
    } catch (error) {
        console.error("Error reading category list:", error);

        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).end();
    }
};
