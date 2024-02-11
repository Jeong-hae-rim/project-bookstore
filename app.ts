import express from "express";
import dotenv from "dotenv";

import booksRouter from "@routes/books";
import cartsRouter from "@routes/carts";
import categoryRouter from "@routes/category";
import likesRouter from "@routes/likes";
import ordersRouter from "@routes/orders";
import usersRouter from "@routes/users";

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
