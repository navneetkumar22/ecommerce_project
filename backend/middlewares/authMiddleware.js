require("dotenv").config();
import User from "../models/userSchema";
import JWT from "jsonwebtoken";
import asyncHandler from "../services/asyncHandler";


export const isLoggedIn = asyncHandler(async (req, res) => {
    let token;

    if (req.cookies.token || (req.headers.authorization && req.headers.authorization.startsWith("Bearer"))) {
        token = req.cookies.token || req.headers.authorization.split(" ")[1]
    }

    if (!token) {
        throw new Error("Not authorized to access this route")
    }

    //if token is present - verify it
    try {
        const decodeJwtPayload = JWT.verify(token, JWT_SECRET)

        //_id, find user based on this id, set this in req.user
        req.user = await User.findById(decodeJwtPayload._id, "name email role")
        next()


    } catch (error) {
        throw new Error("Not authorized to access this route")
    }
})