import { ValidationChain, param, query } from "express-validator";

export const allValidateRules: ValidationChain[] = [
    query("limit").isString().notEmpty(),
    query("currentPage").isString().notEmpty(),
    query("categoryId").isString().notEmpty(),
];

export const detailValidationRules: ValidationChain[] = [param("id").toInt()];
