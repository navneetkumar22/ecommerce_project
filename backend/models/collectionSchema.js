const mongoose = require('mongoose');

const collectionSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, "The name of the collection is required"],
            trim: true,
            maxLength: [100, "Maximum characters allowed are 100"]
        }
    },
    {
        timestamps: true
    }
)

module.exports = new mongoose.model("Collection", collectionSchema);