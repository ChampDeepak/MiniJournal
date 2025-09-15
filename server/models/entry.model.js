import mongoose from 'mongoose';

const entrySchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId, 
        ref: "User",   // links each entry to a user
        required: true
    },
    date: {
        type: Date, 
        required: true
    },
    content: {
        type: String, 
        required: true
    }
}, { timestamps: true }); // adds createdAt & updatedAt automatically

const Entry = mongoose.model("Entry", entrySchema);

export default Entry;
