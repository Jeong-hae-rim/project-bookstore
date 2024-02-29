import crypto from "crypto";

export const salt = crypto.randomBytes(10).toString("base64");
export const hashed = (password: string) =>
    crypto.pbkdf2Sync(password, salt, 10000, 10, "sha512").toString("base64");

export const pwdHashed = (password: string, salt: string) =>
    crypto.pbkdf2Sync(password, salt, 10000, 10, "sha512").toString("base64");
