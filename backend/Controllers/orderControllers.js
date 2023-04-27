const Order = require("../models/orderSchema");
const Coupon = require("../models/couponSchema");
const asyncHandler = require("../services/asyncHandler");

//user controllers

//create an order
exports.createOrder = asyncHandler(async (req, res) => {
    const { products, phoneNumber, address, amount, couponCode } = req.body;

    let totalAmount = 0;

    //validate Coupon and calculate total amount
    const coupon = await Coupon.findOne({ code: couponCode });

    if ((coupon !== null) && (coupon.active)) {
        totalAmount = amount - amount * coupon.discount / 100
    } else {
        throw new Error("Invalid coupon code or coupon has been expired")
    }

    const order = await Order.create({
        products,
        phoneNumber,
        address,
        amount,
        totalAmount,
        user: req.user._id
    });

    res.status(200).json({
        success: true,
        message: "Order placed successfully",
        order
    })
})

//fetch one order
exports.getOneOrder = asyncHandler(async (req, res) => {

    const order = await Order.findById(req.params.id).populate("user", "name email");

    if (!order) {
        throw new Error("Invalid order id.");
    }

    res.status(200).json({
        success: true,
        order
    })
})

//fetch all orders
exports.getAllOrders = asyncHandler(async (req, res) => {

    const orders = await Order.find({ user: req.user._id });

    res.status(200).json({
        success: true,
        orders
    })
})



//admin controllers

//get all orders of all users
exports.adminAllOrders = asyncHandler(async (_req, res) => {

    const allOrders = await Order.find();

    if (!allOrders) {
        throw new Error("There are no orders yet!")
    }

    res.status(200).json({
        success: true,
        orders: allOrders
    })
})

//get all orders of a specific user
exports.adminUserOrders = asyncHandler(async (req, res) => {

    const userOrders = await Order.find({ user: req.params.id });

    if (!userOrders) {
        throw new Error("There are no orders yet!")
    }

    res.status(200).json({
        success: true,
        orders: userOrders
    })
})

//updating an order
exports.adminUpdateOrder = asyncHandler(async (req, res) => {

    const order = await Order.findById(req.params.id);

    if (!order) {
        throw new Error("Invalid order id")
    }

    if (order.status === "DELIVERED") {
        throw new Error("Order is already delivered")
    }

    order.status = req.body.status;

    await order.save();

    res.status(200).json({
        success: true,
        order
    })
})

//delete an order
exports.adminDeleteOrder = asyncHandler(async (req, res) => {

    const order = await Order.findById(req.params.id);

    if (!order) {
        throw new Error("Invalid order id")
    }

    await order.remove();

    res.status(200).json({
        success: true,
        message: "Order is successfully deleted"
    })
})