require('dotenv').config();
const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const userRoutes = require("./routes/userRoutes");
const morgan = require("morgan");
const app = express();

//middlewares
app.use(express.json());
app.use(express.urlencoded({ extended: true }))
app.use(cors());
app.use(cookieParser());

app.use("/", userRoutes)

//morgan logger
app.use(morgan("tiny"));



module.exports = app;