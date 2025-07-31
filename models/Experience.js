const mongoose = require('mongoose');

const experienceSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    company: {
        type: String,
        required: true
    },
    location: String,
    startDate: {
        type: Date,
        required: true
    },
    endDate: Date,
    isCurrent: {
        type: Boolean,
        default: false
    },
    description: {
        type: String,
        required: true
    },
    images: [String],
    responsibilities: [String],
    achievements: [String],
    technologies: [String],
    ownerEmail: { type: String, required: true },
}, { timestamps: true });

module.exports = mongoose.model('Experience', experienceSchema); 