import { Request, Response } from "express";
const { StatusCodes } = require("http-status-codes");

import { Category } from "@model/category.model";
import * as CategoryService from "@service/category.service";

export const allReadCategory = async (req: Request, res: Response) => {
    try {
        let categoryArray: Array<Category> = [];

        categoryArray = await CategoryService.getCategory();

        const formattedResults = categoryArray.map((result) => ({
            categoryId: result.category_id,
            genre: result.genre,
        }));

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
