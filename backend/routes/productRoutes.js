const express = require("express");
const router = express.Router();
const { isLoggedIn, customRole } = require("../middlewares/authMiddleware");
const { getAllProducts, allProducts, getSingleProduct, addReview, deleteReview,
    adminAddProduct, adminUpdateProduct, adminDeleteProduct,
    getAllReviews, allCollectionProducts } = require("../Controllers/productControllers");


//user routes
router.get("/products/all", isLoggedIn, allProducts);
router.get("/products", isLoggedIn, getAllProducts);
router.get("/products/collection/:id", allCollectionProducts)
router.get("/product/:id", isLoggedIn, getSingleProduct);
router.put("/review", isLoggedIn, addReview);
router.delete("/review/:id", isLoggedIn, deleteReview);
router.get("/reviews/:id", getAllReviews)

//admin routes
router.post("/admin/product/add", isLoggedIn, customRole("admin"), adminAddProduct);
router.put("/admin/product/:id", isLoggedIn, customRole("admin"), adminUpdateProduct);
router.delete("/admin/product/:id", isLoggedIn, customRole("admin"), adminDeleteProduct);


module.exports = router;