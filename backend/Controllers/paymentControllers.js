const asyncHandler = require("../services/asyncHandler");
const stripe = require("stripe");
// const razorpay = require("razorpay");

//stripe- send api key and capture payment
exports.sendStripeKey = asyncHandler(async (_req, res) => {

    res.status(200).json({
        stripekey: process.env.STRIPE_API_KEY
    })
})

exports.captureSripePayment = asyncHandler(async (req, res) => {
    const paymentIntent = await stripe.paymentIntents.create({
        amount: req.body.amount,
        currency: "inr"
    })

    res.status(200).json({
        success: true,
        client_secret: paymentIntent.client_secret
    })
})


//razorpay - send api key and capture payment

// exports.sendRazorpayKey = asyncHandler(async (_req, res) => {

//     res.status(200).json({
//         razorpaykey: process.env.RAZORPAY_API_KEY
//     })
// })

// exports.captureRazorpayPayment = asyncHandler(async (req, res) => {

//     const instance = new razorpay({
//         key_id: process.env.RAZORPAY_API_KEY,
//         key_secret: process.env.RAZORPAY_SECRET
//     })

//     const options = {
//         amount: req.body.amount,
//         currency: "INR"
//     }

//     const myOrder = instance.orders.create(options);

//     res.status(200).json({
//         success: true,
//         amount: req.body.amount,
//         order: myOrder
//     })
// })