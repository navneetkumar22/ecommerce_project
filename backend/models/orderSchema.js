const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
    {
        products: [{
            name: {
                type: String,
                required: true
            },
            productId: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Product",
                required: true
            },
            quantity: Number,
            price: Number
        }],

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
        totalAmount: {
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
        }
    },
    {
        timestamps: true
    }
)

module.exports = new mongoose.model("Order", orderSchema);

