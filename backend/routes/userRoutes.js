const express = require('express');
const { home, signUp, login, logout, forgetPassword, resetPassword, updatePassword, userDetails } = require("../Controllers/userControllers");
const { isLoggedIn } = require('../middlewares/authMiddleware');
const router = express.Router();

router.get("/", home);
router.post("/signup", signUp);
router.post("/login", login);
router.get("/logout", logout);
router.post("/password/forget", forgetPassword);
router.post("/password/forget/:resetToken", resetPassword);
router.post("/password/update", isLoggedIn, updatePassword);
router.get("/dashboard", isLoggedIn, userDetails);

module.exports = router;