const express = require('express');
const { home, signUp, login, logout, forgetPassword, resetPassword } = require("../Controllers/userControllers");
const router = express.Router();

router.get("/", home);
router.post("/signup", signUp);
router.post("/login", login);
router.get("/logout", logout);
router.post("/password/forget", forgetPassword);
router.post("/password/forget/:resetToken", resetPassword);

module.exports = router;