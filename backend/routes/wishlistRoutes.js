const express = require("express");
const router = express.Router();
const { isLoggedIn } = require("../middlewares/authMiddleware");
const { getWishList, addToWishList, deleteFromWishList } = require("../Controllers/wishlistControllers");

router.get("/wishlist", isLoggedIn, getWishList);
router.post("/wishlist/:id", isLoggedIn, addToWishList);
router.delete("/wishlist/:id", isLoggedIn, deleteFromWishList);


module.exports = router;