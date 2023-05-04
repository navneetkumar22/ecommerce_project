const express = require("express");
const router = express.Router();
const { isLoggedIn, customRole } = require("../middlewares/authMiddleware");
const { createCollection, updateCollection, deleteCollection, getAllCollection } = require("../Controllers/collectionControllers");

router.get("/collections", getAllCollection);
router.post("/collection/create", isLoggedIn, customRole("admin"), createCollection);
router.put("/collection/:id", isLoggedIn, customRole("admin"), updateCollection);
router.delete("/collection/:id", isLoggedIn, customRole("admin"), deleteCollection);


module.exports = router;