require('dotenv').config();
const express = require("express");
const app = express();
const cors = require("cors");
const cookieParser = require("cookie-parser");
const morgan = require("morgan");
const fileUplaod = require("express-fileupload");

//import all routes
const userRoutes = require("./routes/userRoutes");
const productRoutes = require("./routes/productRoutes");
const paymentRoutes = require("./routes/paymentRoutes");
const collectionRoutes = require("./routes/collectionRoutes");
const couponRoutes = require("./routes/couponRoutes");
const orderRoutes = require("./routes/orderRoutes");
const wishlistRoutes = require("./routes/wishlistRoutes");
const cartRoutes = require("./routes/cartRoutes");

//middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }))
app.use(cors({
    credentials: true,
    origin: true
}));
app.use(cookieParser());
app.use(fileUplaod({
    useTempFiles: true,
    tempFileDir: "/tmp/"
}));

// router middlewares
app.use("/", userRoutes)
app.use("/", productRoutes)
app.use("/", paymentRoutes)
app.use("/", collectionRoutes)
app.use("/", couponRoutes);
app.use("/", orderRoutes);
app.use("/", wishlistRoutes);
app.use("/", cartRoutes);

//morgan logger
app.use(morgan("tiny"));



module.exports = app;