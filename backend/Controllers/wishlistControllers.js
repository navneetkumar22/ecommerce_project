const Wishlist = require("../models/wishlistSchema");
const asyncHandler = require("../services/asyncHandler");

//create a wishlist by adding first product

//get wishlist
exports.getWishList = asyncHandler(async (req, res) => {

    const wishList = await Wishlist.findOne({ user: req.user._id });

    if (!wishList) {
        throw new Error("Wishlist not found")
    }

    res.status(200).json({
        success: true,
        wishList
    })
})

exports.addToWishList = asyncHandler(async (req, res) => {

    const user = req.user._id;
    const product = req.params.id;
    let wishList = await Wishlist.findOne({ user: user });

    if (!wishList) {
        wishList = await Wishlist.create({ user: user, products: [{ product }] })
    } else {
        wishList.products.push({ product });
        await wishList.save();
    }

    res.status(200).json({
        success: true,
        wishList
    })

})


//delete a product from wishlist
exports.deleteFromWishList = asyncHandler(async (req, res) => {

    const productId = req.params.id;
    const wishList = await Wishlist.findOne({ user: req.user._id })

    if (!wishList) {
        throw new Error("Wishlist not found")
    }

    // find index of the product
    const productIndex = wishList.products.findIndex((element) => element.id === productId);
    if (productIndex === -1) {
        throw new Error("Product not found in the wishlist")
    }

    // remove this index and save
    wishList.products.splice(productIndex, 1);
    await wishList.save();

    res.status(200).json({
        success: true,
        message: "Product successfully removed from wishlist"
    })
})