import express from "express";
import dotenv = require("dotenv");

dotenv.config();

let app = express();
app.use(express.urlencoded({ extended: false }));

app.listen(process.env.PORT, () => {
    console.log("**----------------------------------------**");
    console.log(`====       port ${process.env.PORT} is running...      ====`);
    console.log("**----------------------------------------**");
});

const userRouter = require("./routes/users");
const bookRouter = require("./routes/books");
const categoryRouter = require("./routes/category");
const cartRouter = require("./routes/carts");
const likeRouter = require("./routes/likes");
const orderRouter = require("./routes/orders");

app.use("/users", userRouter);
app.use("/books", bookRouter);
app.use("/category", categoryRouter);
app.use("/carts", cartRouter);
app.use("/likes", likeRouter);
app.use("/orders", orderRouter);
