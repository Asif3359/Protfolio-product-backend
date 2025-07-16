const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    technologies: [{
        type: String,
        required: true
    }],
    // image: String,
    images: [String],
    startDate: {
        type: Date,
        required: true
    },
    endDate: Date,
    link: String,
    githubLink: String,
    features: [String],
    status: {
        type: String,
        enum: ['In Progress', 'Completed', 'On Hold'],
        default: 'In Progress'
    },
    ownerEmail: { type: String, required: true },
    
}, { timestamps: true });

module.exports = mongoose.model('Project', projectSchema); 