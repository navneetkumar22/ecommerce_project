const express = require("express");
const router = express.Router();
const { isLoggedIn } = require("../middlewares/authMiddleware");
const { sendStripeKey, sendRazorpayKey,
    captureSripePayment, captureRazorpayPayment } = require("../Controllers/paymentControllers");

router.get("/stripekey", isLoggedIn, sendStripeKey);
router.get("/razorpaykey", isLoggedIn, sendRazorpayKey);


router.post("/capturestripe", isLoggedIn, captureSripePayment);
router.post("/capturerazorpay", isLoggedIn, captureRazorpayPayment);


module.exports = router;