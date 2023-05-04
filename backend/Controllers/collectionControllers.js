const Collection = require("../models/collectionSchema");
const asyncHandler = require("../services/asyncHandler");


//only admin can create collection

//create a collection
exports.createCollection = asyncHandler(async (req, res) => {
    const { name } = req.body;

    if (!name) {
        throw new Error("Collection name is required")
    }

    const collection = await Collection.create({ name });

    res.status(200).json({
        success: true,
        collection
    })
})

//get all collection
exports.getAllCollection = asyncHandler(async (_req, res) => {
    const collections = await Collection.find();

    if (!collections) {
        throw new Error("There is no collection")
    }

    res.status(200).json({
        success: true,
        collections
    })
})

//update collection
exports.updateCollection = asyncHandler(async (req, res) => {

    const collection = await Collection.findByIdAndUpdate(req.params.id, { name: req.body.name }, {
        new: true,
        runValidators: true,
        useFindAndModify: false
    });

    res.status(200).json({
        success: true,
        message: "Collection updated successfully",
        collection
    })
})


//delete collection
exports.deleteCollection = asyncHandler(async (req, res) => {
    const collection = await Collection.findById(req.params.id);

    if (!collection) {
        throw new Error("No such collection is found")
    }

    await collection.deleteOne();

    res.status(200).json({
        success: true,
        message: "Collection deleted successfully"
    })
})