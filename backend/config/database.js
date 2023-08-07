const mongoose = require("mongoose");

const connectToDB = () => {
    mongoose
        .connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
        .then(conn => {
            console.log(`Connected to Database: ${conn.connection.host}`);
        })
        .catch(err => {
            console.log(err.message);
            process.exit(1);
        })
}

module.exports = connectToDB;