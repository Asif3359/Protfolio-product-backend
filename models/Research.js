const mongoose = require('mongoose');

const researchSchema = new mongoose.Schema({
    type: {
        type: String,
        enum: ['Publication', 'Current Research'],
        required: true
    },
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    authors: [{
        type: String,
        required: true
    }],
    publicationDate: Date,
    journal: String,
    doi: String,
    link: String,
    status: {
        type: String,
        enum: ['In Progress', 'Completed', 'Published'],
        default: 'In Progress'
    },
    ownerEmail: { type: String, required: true },
}, { timestamps: true });

module.exports = mongoose.model('Research', researchSchema); 