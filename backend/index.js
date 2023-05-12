// require('dotenv').config();
const mongoose = require("mongoose");
const app = require("./app");
const cloudinary = require("cloudinary");

//iife function - to connect to database immediately
(async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        })
        console.log("DataBase CONNECTED");

        app.on('error', (err) => {
            console.log("ERROR: ", err);
            throw err;
        })

        app.listen(process.env.PORT, () => {
            console.log(`Listening on ${process.env.PORT}`);
        })


    } catch (error) {
        console.log(error.message);
        process.exit(1);
    }
})()

//cloudinary configuration
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
})