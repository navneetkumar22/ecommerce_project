const mongoose = require("mongoose");
const AuthRoles = require('../utils/AuthRoles');
const bcrypt = require("bcryptjs");
const JWT = require("jsonwebtoken");
const crypto = require("crypto");

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Name is required"],
        maxlength: [30, "Maximum length allowed is 30 characters"]
    },
    email: {
        type: String,
        required: [true, "Email is required"],
        unique: true
    },
    password: {
        type: String,
        required: [true, "Password is required"],
        minlength: [8, "Minimum length is 8 characters"],
        select: false
    },
    role: {
        type: String,
        enum: Object.values(AuthRoles),
        default: AuthRoles.USER
    },
    forgotPasswordToken: String,
    forgotPasswordExpiry: Date
},
    {
        timestamps: true
    }
);

//encrypting the password - mongoose hooks
userSchema.pre("save", async function (next) {
    if (!this.isModified("password")) return next();
    this.password = await bcrypt.hash(this.password, 10);

    next();
})

//mongoose methods
userSchema.methods = {
    //compare password
    comparePassword: async function (enteredPwd) {
        return await bcrypt.compare(enteredPwd, this.password)
    },

    //Generate JWT Token
    getJwtToken: function () {
        return JWT.sign({ _id: this._id }, process.env.JWT_SECRET,
            {
                expiresIn: process.env.JWT_EXPIRY || "30d"
            }
        )
    },

    //Generate forgot password token
    generateForgotPasswordToken: function () {
        const forgotToken = crypto.randomBytes(20).toString('hex');

        //save to database and send the same to user
        this.forgotPasswordToken = crypto.createHash('sha256')
            .update(forgotToken)
            .digest('hex')

        this.forgotPasswordExpiry = Date.now() + 20 * 60 * 1000;

        //return same token to user
        return forgotToken;
    }

}

module.exports = new mongoose.model("User", userSchema);