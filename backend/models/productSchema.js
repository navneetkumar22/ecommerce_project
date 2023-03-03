import mongoose from "mongoose";

const productSchema = mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, "Name of the product is required"],
            trim: true,
            maxlength: [120, "Name of product should not exceed 120 characters"]
        },
        price: {
            type: Number,
            required: [true, "Price of the product is required"],
            maxlength: [6, "Price of the product should not exceed 6 digits"]
        },
        description: {
            type: String,
            // have to use some editors
        },
        photos: [{
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
        }

        //can add ratings and reviews also
    }
)