import express from "express";
import dotenv from "dotenv";

import booksRouter from "@router/books";
import cartsRouter from "@router/carts";
import categoryRouter from "@router/category";
import likesRouter from "@router/likes";
import ordersRouter from "@router/orders";
import usersRouter from "@router/users";

dotenv.config();

let app = express();
app.use(express.urlencoded({ extended: false }));

app.listen(process.env.PORT, () => {
    console.log("**----------------------------------------**");
    console.log(`====       port ${process.env.PORT} is running...      ====`);
    console.log("**----------------------------------------**");
});

app.use("/books", booksRouter);
app.use("/carts", cartsRouter);
app.use("/category", categoryRouter);
app.use("/likes", likesRouter);
app.use("/orders", ordersRouter);
app.use("/users", usersRouter);
