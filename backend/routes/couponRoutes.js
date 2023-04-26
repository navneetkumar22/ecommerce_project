const express = require("express");
const router = express.Router();
const { isLoggedIn, customRole } = require('../middlewares/authMiddleware');
const { createCoupon, getAllCoupons, updateCoupon, deleteCoupon } = require("../Controllers/couponControllers");

//Only admin can create/update coupons
router.post("/coupon/create", isLoggedIn, customRole("admin"), createCoupon);
router.get("/coupons", isLoggedIn, customRole("admin"), getAllCoupons);
router.put("/coupon/:id", isLoggedIn, customRole("admin"), updateCoupon);
router.delete("/coupon/:id", isLoggedIn, customRole("admin"), deleteCoupon);


module.exports = router;