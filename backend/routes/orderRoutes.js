const express = require("express");
const { isLoggedIn, customRole } = require("../middlewares/authMiddleware");
const { createOrder, getAllOrders, getOneOrder,
    adminAllOrders, adminUserOrders, adminUpdateOrder, adminDeleteOrder
} = require("../Controllers/orderControllers");
const router = express.Router();

//user routes
router.post("/order/create", isLoggedIn, createOrder);
router.get("/order/all", isLoggedIn, getAllOrders);
router.get("/order/:id", isLoggedIn, customRole("admin"), getOneOrder);


// admin routes
router.get("/admin/order/all", isLoggedIn, customRole("admin"), adminAllOrders);
router.get("/admin/user/orders/:id", isLoggedIn, customRole("admin"), adminUserOrders);
router.put("/admin/user/order/:id", isLoggedIn, customRole("admin"), adminUpdateOrder);
router.delete("/admin/user/order/:id", isLoggedIn, customRole("admin"), adminDeleteOrder);


module.exports = router;