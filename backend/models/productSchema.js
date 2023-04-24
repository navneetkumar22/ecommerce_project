const mongoose = require("mongoose");

const productSchema = mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, "Name of the product is required"],
            trim: true,
            maxlength: [120, "Product name should not exceed 120 characters"]
        },
        price: {
            type: Number,
            required: [true, "Price of the product is required"],
            maxlength: [6, "Price of the product should not exceed 6 digits"]
        },
        description: {
            type: String,
            required: [true, "Please provide a description of product"]
        },
        photos: [{
            id: {
                type: String,
                required: true
            },
            image_url: {
                type: String,
                required: [true, "Url of the image is required"]
            }
        }],
        stock: {
            type: Number,
            default: 0
        },
        sold: {
            type: Number,
            default: 0
        },
        collectionId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "Collection"
        },
        ratings: {
            type: Number,
            default: 0
        },
        numberOfReviews: {
            type: Number,
            default: 0
        },
        reviews: [
            {
                user: {
                    type: mongoose.Schema.Types.ObjectId,
                    ref: "User",
                    required: true
                },
                name: {
                    type: String,
                    required: true
                },
                rating: {
                    type: Number,
                    required: true
                },
                comment: {
                    type: String,
                    required: true
                }
            }
        ],
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User",
            required: true
        }
    },
    {
        timestamps: true
    }
)

module.exports = mongoose.model("Product", productSchema)