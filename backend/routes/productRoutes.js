const express = require("express");
const router = express.Router();
const { isLoggedIn, customRole } = require("../middlewares/authMiddleware");
const { getAllProducts, allProducts, getSingleProduct, addReview, deleteReview,
    adminAddProduct, adminUpdateProduct, adminDeleteProduct,
    getAllReviews, allCollectionProducts } = require("../Controllers/productControllers");


//user routes
router.get("/products/all", allProducts);
router.get("/products", getAllProducts);
router.get("/products/collection/:id", allCollectionProducts);
router.get("/product/:id", getSingleProduct);
router.put("/review/add", isLoggedIn, addReview);
router.delete("/review/:id", isLoggedIn, deleteReview);
router.get("/reviews/:id", getAllReviews)

//admin routes
router.post("/admin/product/add", isLoggedIn, customRole("admin"), adminAddProduct);
router.put("/admin/product/:id", isLoggedIn, customRole("admin"), adminUpdateProduct);
router.delete("/admin/product/:id", isLoggedIn, customRole("admin"), adminDeleteProduct);


module.exports = router;