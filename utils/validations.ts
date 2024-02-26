import { ValidationChain, body, param, query } from "express-validator";

// book api validation
export const bookReadValidateRules: ValidationChain[] = [
    query("limit").isString().notEmpty(),
    query("currentPage").isString().notEmpty(),
    query("categoryId").isString().notEmpty(),
];

export const bookDetailValidationRules: ValidationChain[] = [
    param("id").toInt(),
];

// user api validation
export const userJoinValidateRules: ValidationChain[] = [
    body("email").isEmail().notEmpty(),
    body("name").notEmpty(),
    body("password").isLength({ min: 5 }).notEmpty(),
];
