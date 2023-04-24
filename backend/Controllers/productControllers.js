const Product = require("../models/productSchema");
const asyncHandler = require("../services/asyncHandler");
const cloudinary = require("cloudinary");
const WhereClause = require("../utils/whereClause");


/**
 * Admin Routes
 * */

//add a product
exports.adminAddProduct = asyncHandler(async (req, res, next) => {
    //handling images
    let imageArray = [];

    if (!req.files) {
        throw new Error("Images are required");
    }

    if (req.files) {
        for (let i = 0; i < req.files.photos.length; i++) {
            let result = await cloudinary.v2.uploader.upload(
                req.files.photos[i].tempFilePath, {
                folder: "products"
            }
            );

            imageArray.push({
                id: result.public_id,
                image_url: result.secure_url
            });
        }
    }

    req.body.photos = imageArray;
    req.body.user = req.user.id;

    const product = await Product.create(req.body);

    res.status(200).json({
        success: true,
        product
    })
})

//update a product
exports.adminUpdateProduct = asyncHandler(async (req, res, next) => {
    let product = await Product.findById(req.params.id);

    if (!product) {
        throw new Error("Product not found")
    }

    //removing existing images of product
    if (req.files) {
        for (let i = 0; i < product.photos.length; i++) {
            await cloudinary.v2.uploader.destroy(product.photos[i].id)
        }
    }

    //save new images
    let imageArray = [];
    for (let i = 0; i < req.files.photos.length; i++) {
        let result = await cloudinary.v2.uploader.upload(
            req.files.photos[i].tempFilePath, {
            folder: "products"
        }
        )
        imageArray.push({
            id: result.public_id,
            image_url: result.secure_url
        })
    }

    req.body.photos = imageArray;
    product = await Product.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true,
        useFindAndModify: false
    })

    res.status(200).json({
        success: true,
        message: "Product updated successfully",
        product
    })
})

//delete a product
exports.adminDeleteProduct = asyncHandler(async (req, res, next) => {

    const product = await Product.findById(req.params.id);

    //removing images of product
    for (let i = 0; i < product.photos.length; i++) {
        await cloudinary.v2.uploader.destroy(product.photos[i].id)
    }

    await product.remove();

    res.status(200).json({
        success: true,
        message: "Product deleted successfully"
    })
})


//user controllers

//fetch all products - with search query
exports.getAllProducts = asyncHandler(async (req, res, next) => {
    const resultPerPage = 6;
    const totalProductsCount = await Product.countDocuments();

    let productsObj = new WhereClause(Product.find(), req.query).search().filter();

    productsObj.pager(resultPerPage);
    const products = await productsObj.base.clone();
    const filteredProductsCount = products.length;

    res.status(200).json({
        success: true,
        products,
        filteredProductsCount,
        totalProductsCount
    })
})

//all products
exports.allProducts = asyncHandler(async (req, res, next) => {
    const products = await Product.find();

    res.status(200).json({
        success: true,
        products
    })
})

//fetch one product
exports.getSingleProduct = asyncHandler(async (req, res, next) => {
    const product = await Product.findById(req.params.id);

    if (!product) {
        throw new Error("No such product is available")
    }

    res.status(200).json({
        success: true,
        product
    })
})

//add a review
exports.addReview = asyncHandler(async (req, res, next) => {
    const { rating, comment, productId } = req.body;

    const review = {
        user: req.user._id,
        name: req.user.name,
        rating: Number(rating),
        comment
    }

    const product = await Product.findById(productId);

    const alreadyReviewed = product.reviews.find((rev) => rev.user.toString() === req.user._id.toString())
    if (alreadyReviewed) {
        product.reviews.forEach((review) => {
            if (review.user.toString() === req.user._id.toString()) {
                review.comment = comment;
                review.rating = rating;
            }
        })
    } else {
        product.reviews.push(review);
        product.numberOfReviews = product.reviews.length
    }

    //adjust ratings of product
    product.ratings = product.reviews.reduce((acc, item) => (item.rating + acc, 0)) / product.reviews.length

    //save
    await product.save({ validateBeforeSave: false });
    res.status(200).json({
        success: true,
        message: "Review is added successfully"
    })
})

//delete a review
exports.deleteReview = asyncHandler(async (req, res, next) => {
    const productId = req.params.id;
    const product = await Product.findById(productId);

    const reviews = product.reviews.filter((rev) => rev.user.toString() === req.user._id.toString())
    const numberOfReviews = reviews.length;

    product.ratings = product.reviews.reduce((acc, item) => (item.rating + acc, 0)) / product.reviews.length

    //update the product
    await Product.findByIdAndUpdate(productId, { reviews, ratings, numberOfReviews }, {
        new: true,
        runValidators: false,
        useFindAndModify: false
    })

    res.status(200).json({
        success: true,
        message: "Review of the product deleted successfully"
    })
})

//fetch all reviews for a product
exports.getAllReviews = asyncHandler(async (req, res, next) => {
    const product = await Product.findById(req.params.id);

    res.status(200).json({
        success: true,
        reviews: product.reviews
    })
})