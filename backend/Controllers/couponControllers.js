const Coupon = require("../models/couponSchema");
const asyncHandler = require("../services/asyncHandler");


//create a coupon
exports.createCoupon = asyncHandler(async (req, res) => {
    const { code, discount, active } = req.body;

    if (!(code || discount)) {
        throw new Error("Coupon code and discount field is required")
    }

    const coupon = await Coupon.create({ code, discount, active });

    res.status(200).json({
        success: true,
        coupon
    })
})

//get all coupons
exports.getAllCoupons = asyncHandler(async (_req, res) => {
    const coupons = await Coupon.find();

    if (!coupons) {
        throw new Error("No coupon found in database")
    }

    res.status(200).json({
        success: true,
        coupons
    })
})

//update coupon
exports.updateCoupon = asyncHandler(async (req, res) => {

    const { code, discount, active } = req.body;
    const coupon = await Coupon.findByIdAndUpdate(req.params.id, { code, discount, active }, {
        new: true,
        runValidators: true
    });

    res.status(200).json({
        success: true,
        coupon
    })
})

//delete the coupon
exports.deleteCoupon = asyncHandler(async (req, res) => {
    const coupon = await Coupon.findById(req.params.id);

    if (!coupon) {
        throw new Error("No such coupon is available")
    }

    await coupon.deleteOne();

    res.status(200).json({
        success: true,
        message: "Coupon deleted successfully"
    })
})