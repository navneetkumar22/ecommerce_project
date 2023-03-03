import mongoose from "mongoose";

const orderSchema = new mongoose.Schema(
    {
        products: {
            type: [{
                productId: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: "Product",
                    required: true
                },
                count: Number,
                price: Number
            }],
            required: true
        },
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        },
        phoneNumber: {
            type: Number,
            required: [true, "Phone number is required"]
        },
        amount: {
            type: Number,
            required: true
        },
        couponCode: String,
        transactionId: String,
        address: {
            type: String,
            required: [true, "Address is required"]
        },
        status: {
            type: String,
            enum: ["ORDERED", "SHIPPED", "PENDING", "DELIVERED"],
            default: "ORDERED"
            //improve this like authroles
        }


    }
)