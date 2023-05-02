const User = require("../models/userSchema");
const asyncHandler = require("../services/asyncHandler");
const cookieOptions = require("../utils/cookieOptions");
const crypto = require("crypto");
const mailHelper = require("../utils/emailHelper");


//home route
exports.home = (_req, res) => {
    res.send("<h1>Hello world, this is an ecommerce app</h1>")
}


/************************************************************** 
 * @SIGN_UP 
 * @Request_type POST
 * @Route http://localhost:4000/api/auth/signup
 * @description User signUp Controller for creating new user
 * @parameters name, email, password
 * @returns User Object
 ***************************************************************/

exports.signUp = asyncHandler(async (req, res) => {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
        throw new Error("All fields are required")
    }

    //check if user exists
    const userExists = await User.findOne({ email })
    if (userExists) {
        throw new Error("User already exists")
    }

    //register the user
    const user = await User.create({
        name,
        email,
        password
    });
    const token = user.getJwtToken()
    user.password = undefined

    res.cookie("token", token, cookieOptions)
    res.status(200).json({
        success: true,
        token,
        user
    })
})


/************************************************************** 
 * @SIGN_IN 
 * @Request_type POST
 * @Route http://localhost:4000/api/auth/signin
 * @description User signIn Controller for signing in a user
 * @parameters email, password
 * @returns User Object
 ***************************************************************/

exports.login = asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        throw new Error("All fields are required")
    }

    //check if user exists
    const user = await User.findOne({ email }).select("+password")

    if (!user) {
        throw new Error("Invalid Credentials")
    }

    //validate the entered password
    const isPasswdCorrect = await user.comparePassword(password)
    if (isPasswdCorrect) {
        const token = user.getJwtToken()
        user.password = undefined
        res.cookie("token", token, cookieOptions)
        return res.status(200).json({
            success: true,
            token,
            user
        })
    }

    throw new Error("Invalid credentials")

})


/************************************************************** 
 * @SIGN_OUT
 * @Request_type GET/POST
 * @Route http://localhost:4000/api/auth/signout
 * @description User signOut by clearing user cookies
 * @parameters
 * @returns success message 
 ***************************************************************/

exports.logout = asyncHandler(async (_req, res) => {
    res.cookie("token", null, {
        expires: new Date(Date.now()),
        httpOnly: true
    })
    res.status(200).json({
        success: true,
        message: "Logged Out"
    })
})


//forget Password controller
exports.forgetPassword = asyncHandler(async (req, res) => {
    const { email } = req.body;
    const user = await User.findOne({ email });

    const forgetToken = user.generateForgotPasswordToken();
    await user.save({ validateBeforeSave: false });

    const myUrl = `${req.protocol}://${req.get("host")}/password/forget/${forgetToken}`;
    const message = `Copy Paste this link in your URL and hit enter \n\n ${myUrl}`;

    //send email
    try {
        await mailHelper({
            email: user.email,
            subject: "Ecommerce Store - Password reset email",
            text: message
        });

        res.status(200).json({
            success: true,
            message: "Email sent successfully"
        })
    } catch (error) {
        user.forgotPasswordToken = undefined;
        user.forgotPasswordExpiry = undefined;
        await user.save({ validateBeforeSave: false });

        return new Error(error.message);
    }

})


/************************************************************** 
 * @Reset_Password
 * @Request_type
 * @Route http://localhost:4000/password/reset/:resetToken
 * @description User will be allowed to reset password
 * @parameters token from url, password and confirmPassword
 * @returns user object
 ***************************************************************/

exports.resetPassword = asyncHandler(async (req, res) => {
    const resetToken = req.params.resetToken;
    const { password, confirmPassword } = req.body;

    const resetPasswordToken = crypto
        .createHash("sha256")
        .update(resetToken)
        .digest("hex")

    //grab the user from database
    const user = await User.findOne({
        forgotPasswordToken: resetPasswordToken,
        forgotPasswordExpiry: { $gt: Date.now() }
    });

    if (!user) {
        throw new Error("Password token is invalid or expired")
    }

    if (password !== confirmPassword) {
        throw new Error("Password and Confirm Password does not match")
    }

    //save user with new password
    user.password = password;
    user.forgotPasswordToken = undefined
    user.forgotPasswordExpiry = undefined

    await user.save()

    //create token and send as response
    const token = user.getJwtToken()
    user.password = undefined

    res.cookie("token", token, cookieOptions)
    res.status(200).json({
        success: true,
        user
    })

})

//change password
exports.updatePassword = asyncHandler(async (req, res) => {

    const user = await User.findById(req.user._id).select("+password");

    const isOldPasswordCorrect = await user.comparePassword(req.body.password);

    if (!isOldPasswordCorrect) {
        throw new Error("Old password is incorrect")
    }

    user.password = req.body.newPassword;
    await user.save();

    user.password = undefined;
    res.status(200).json({
        success: true,
        message: "Password updated successfully",
        user
    })
})


/************************************************************** 
 * @Get_profile
 * @Request_type GET
 * @Route http://localhost:4000/api/auth/profile
 * @description check for token and populate req.user
 * @parameters 
 * @returns user object
 ***************************************************************/

exports.userProfile = asyncHandler(async (req, res) => {
    const user = req;
    if (!user) {
        throw new Error("User not found")
    }
    res.status(200).json({
        success: true,
        user
    })

})


//user dashboard
exports.userDetails = asyncHandler(async (req, res) => {
    const user = await User.findById(req.user._id);

    res.status(200).json({
        success: true,
        user
    })
})


//update user details
exports.updateUserDetails = asyncHandler(async (req, res) => {
    const newDetails = {
        name: req.body.name,
        email: req.body.email
    };

    const user = await User.findByIdAndUpdate(req.user._id, newDetails, {
        new: true,
        runValidators: true,
        useFindAndModify: false
    });

    res.status(200).json({
        success: true,
        message: "User details updated successfully"
    })
})




/**
 * Admin controllers
 * 
 * get all user
 * get a single user
 * 
 * delete a user 
 */

//fetch all users
exports.adminAllUsers = asyncHandler(async (_req, res) => {
    const users = await User.find({ role: "user" });

    res.status(200).json({
        success: true,
        users
    })
})

//get a single user
exports.adminGetOneUser = asyncHandler(async (req, res) => {
    const user = await User.findById(req.params.id);

    if (!user) {
        throw new Error("User not found in database");
    }

    res.status(200).json({
        success: true,
        user
    })
})

//update a user
exports.adminUpdateOneUser = asyncHandler(async (req, res) => {
    const newData = {
        name: req.body.name,
        email: req.body.email,
        role: req.body.role
    }

    const user = await User.findByIdAndUpdate(req.params.id, newData, {
        new: true,
        runValidators: true,
        useFindAndModify: false
    })

    res.status(200).json({
        success: true,
        message: "User details updated successfully"
    })
})

//delete a user
exports.adminDeleteUSer = asyncHandler(async (req, res) => {
    const user = await User.findById(req.params.id);

    if (!user) {
        throw new Error("No such user found")
    }

    await user.deleteOne();

    res.status(200).json({
        success: true,
        message: "User deleted successfully"
    })
})

