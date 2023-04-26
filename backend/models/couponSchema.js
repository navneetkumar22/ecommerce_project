const mongoose = require("mongoose");

const couponSchema = mongoose.Schema(
    {
        code: {
            type: String,
            required: [true, "Coupon code is required to avail the discount"]
        },
        discount: {
            type: Number,
            default: 0
        },
        active: {
            type: Boolean,
            default: true
        }
    },
    {
        timestamps: true
    }
)

module.exports = new mongoose.model("Coupon", couponSchema);