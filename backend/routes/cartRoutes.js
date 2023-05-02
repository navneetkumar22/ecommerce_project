const express = require("express");
const router = express.Router();
const { isLoggedIn } = require("../middlewares/authMiddleware");
const { getCart, addToCart, deleteProductFromCart } = require("../Controllers/cartControllers");

router.get("/cart", isLoggedIn, getCart);
router.post("/cart/add/:id", isLoggedIn, addToCart);
router.delete("/cart/delete/:id", isLoggedIn, deleteProductFromCart);


module.exports = router;