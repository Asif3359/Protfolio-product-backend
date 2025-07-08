const mongoose = require('mongoose');

const academicSchema = new mongoose.Schema({
    degree: {
        type: String,
        required: true
    },
    institution: {
        type: String,
        required: true
    },
    field: {
        type: String,
        required: true
    },
    startDate: {
        type: Date,
        required: true
    },
    endDate: Date,
    description: String,
    achievements: [String],
    gpa: Number,
    ownerEmail: { type: String, required: true },
}, { timestamps: true });

module.exports = mongoose.model('Academic', academicSchema); 