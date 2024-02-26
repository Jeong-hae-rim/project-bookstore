import express from "express";
import dotenv from "dotenv";
import cors from "cors";

import booksRouter from "@router/book.router";
import cartsRouter from "@router/carts";
import categoryRouter from "@router/category.router";
import likesRouter from "@router/likes";
import ordersRouter from "@router/orders";
import usersRouter from "@router/users";

dotenv.config();

const corsOptions = {
    origin: "http://localhost:3000",
    credentials: true,
};

let app = express();
app.use(express.urlencoded({ extended: false }));

app.listen(process.env.PORT, () => {
    console.log("**----------------------------------------**");
    console.log(`====       port ${process.env.PORT} is running...      ====`);
    console.log("**----------------------------------------**");
});

app.use("/books", cors(corsOptions), booksRouter);
app.use("/carts", cors(corsOptions), cartsRouter);
app.use("/category", cors(corsOptions), categoryRouter);
app.use("/likes", cors(corsOptions), likesRouter);
app.use("/orders", cors(corsOptions), ordersRouter);
app.use("/users", cors(corsOptions), usersRouter);
