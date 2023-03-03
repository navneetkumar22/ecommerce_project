import mongoose from "mongoose";
import app from "./app";

//iife function - to connect to database immediately
(async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI)
        console.log("DB CONNECTED");

        app.on('error', (err) => {
            console.log("ERROR: ", err);
            throw err;
        })

        const onListening = () => {
            console.log(`Listening on ${process.env.PORT}`);
        }

        app.listen(process.env.PORT, onListening)


    } catch (error) {
        console.log(error.message);
        process.exit(1);
    }
})()