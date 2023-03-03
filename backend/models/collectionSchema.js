import mongoose from 'mongoose';

const collectionSchema = mongoose.Schema(
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

export default mongoose.model("Collection", collectionSchema);