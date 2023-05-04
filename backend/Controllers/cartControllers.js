const Cart = require("../models/cartSchema");
const asyncHandler = require("../services/asyncHandler");


//get all items in cart
exports.getCart = asyncHandler(async (req, res) => {

    const cart = await Cart.findOne({ user: req.user._id })

    if (!cart) {
        throw new Error("Your cart is empty")
    }

    res.status(200).json({
        success: true,
        cart
    })
})


//add to cart
exports.addToCart = asyncHandler(async (req, res) => {

    const userId = req.user._id;
    const productId = req.params.id;
    const quantity = req.body.quantity;

    //find existing cart
    let cart = await Cart.findOne({ user: userId });

    //if cart not existed- create one
    if (!cart) {
        await Cart.create({ user: userId, products: [{ productId }] });
    }

    //if product is already existed in cart then update quantity
    const existingProductIndex = cart.products.findIndex(item => item.product == productId);
    if (existingProductIndex !== -1) {
        cart.products[existingProductIndex].quantity += quantity || 1;
    } else {
        cart.products.push({ product: productId, quantity: quantity || 1 })
    }

    await cart.save();

    res.status(200).json({
        success: true,
        cart
    })

})


//delete a product from cart
exports.deleteProductFromCart = asyncHandler(async (req, res) => {

    const productId = req.params.id;
    let cart = await Cart.findOne({ user: req.user._id });

    if (!cart) {
        throw new Error("You haven't added any product to the cart yet")
    }

    //if product is already existed in cart then remove it
    const existingProductIndex = cart.products.findIndex((item) => item.id === productId);
    if (existingProductIndex === -1) {
        throw new Error("Product not existed in cart")
    }

    cart.products.splice(existingProductIndex, 1);
    await cart.save();

    res.status(200).json({
        success: true,
        message: "Product removed from the cart successfully"
    })

})