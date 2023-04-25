require('dotenv').config();
const express = require("express");
const app = express();
const cors = require("cors");
const cookieParser = require("cookie-parser");
const morgan = require("morgan");

//import all routes
const userRoutes = require("./routes/userRoutes");
const productRoutes = require("./routes/productRoutes");
const paymentRoutes = require("./routes/paymentRoutes");

//middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }))
app.use(cors());
app.use(cookieParser());

// router middlewares
app.use("/", userRoutes)
app.use("/", productRoutes)
app.use("/", paymentRoutes)

//morgan logger
app.use(morgan("tiny"));



module.exports = app;