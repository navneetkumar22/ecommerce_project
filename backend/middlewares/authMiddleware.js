const User = require("../models/userSchema");
const JWT = require("jsonwebtoken");
const asyncHandler = require("../services/asyncHandler");


exports.isLoggedIn = asyncHandler(async (req, _res, next) => {
    const token = req.cookies.token;

    if (!token) {
        throw new Error("Not authorized to access this route")
    }

    //if token is present - verify it and set as req.user
    const decoded = JWT.verify(token, process.env.JWT_SECRET)
    req.user = await User.findById(decoded._id)

    next();
});