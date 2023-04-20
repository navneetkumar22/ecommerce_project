const mongoose = require("mongoose");
const app = require("./app");

//iife function - to connect to database immediately
(async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI)
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