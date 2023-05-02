const express = require('express');
const { home, signUp, login, logout, forgetPassword, resetPassword, updatePassword,
    userDetails, updateUserDetails, adminAllUsers, adminGetOneUser, adminUpdateOneUser, adminDeleteUSer } = require("../Controllers/userControllers");

const { isLoggedIn, customRole } = require('../middlewares/authMiddleware');
const router = express.Router();

//user routes
router.get("/", home);
router.post("/signup", signUp);
router.post("/login", login);
router.get("/logout", logout);
router.post("/password/forget", forgetPassword);
router.post("/password/forget/:resetToken", resetPassword);
router.post("/password/update", isLoggedIn, updatePassword);
router.get("/dashboard", isLoggedIn, userDetails);
router.post("/dashboard/update", isLoggedIn, updateUserDetails);

//admin routes
router.get("/admin/users", isLoggedIn, customRole("admin"), adminAllUsers);
router.get("/admin/user/:id", isLoggedIn, customRole("admin"), adminGetOneUser);
router.put("/admin/user/:id", isLoggedIn, customRole("admin"), adminUpdateOneUser);
router.delete("/admin/user/:id", isLoggedIn, customRole("admin"), adminDeleteUSer);

module.exports = router;