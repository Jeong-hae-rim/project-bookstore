import express from "express";
import dotenv from "dotenv";
import cors from "cors";

import booksRouter from "@router/book.router";
import cartsRouter from "@router/carts";
import categoryRouter from "@router/category.router";
import likesRouter from "@router/like.router";
import ordersRouter from "@router/orders";
import usersRouter from "@router/users.route";

dotenv.config();

const corsOptions = {
    origin: "http://localhost:3000",
    credentials: true,
};

let app = express();
app.use(express.urlencoded({ extended: false }));
app.use(cors(corsOptions));

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
