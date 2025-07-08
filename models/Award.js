const mongoose = require('mongoose');

const awardSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    issuer: {
        type: String,
        required: true
    },
    date: {
        type: Date,
        required: true
    },
    description: String,
    category: {
        type: String,
        enum: ['Academic', 'Professional', 'Research', 'Other'],
        required: true
    },
    link: String,
    ownerEmail: { type: String, required: true },
}, { timestamps: true });

module.exports = mongoose.model('Award', awardSchema); 