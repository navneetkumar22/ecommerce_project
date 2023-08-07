const app = require("./app");
const cloudinary = require("cloudinary");

app.listen(process.env.PORT, () => {
    console.log(`Listening on ${process.env.PORT}`);
})

//cloudinary configuration
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
})