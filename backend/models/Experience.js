import mongoose from 'mongoose';

const experienceSchema = mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    name: {
        type: String,
        required: true
    },
    message: {
        type: String,
        required: true
    },
    role: {
        type: String, // e.g. "Beginner Investor"
        default: "Investor"
    }
}, {
    timestamps: true
});

const Experience = mongoose.model('Experience', experienceSchema);

export default Experience;
