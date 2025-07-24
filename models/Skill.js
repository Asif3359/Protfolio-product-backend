const mongoose = require('mongoose');

const skillSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    type: {
        type: String,
        required: true,
        enum: ['Technical', 'Soft', 'Language','Other']
    },
    category: {
        type: String,
        required: true,
        enum: ['Programming', 'Framework', 'Database', 'Tool', 'Language', 'Design', 'DevOps', 'Cloud', 'Other']
    },
    // proficiency: {
    //     type: Number,
    //     required: true,
    //     min: 1,
    //     max: 100
    // },
    logo: {
        type: String,
        required: true
    },
    description: String,
    ownerEmail: { type: String, required: true },
}, { timestamps: true });

module.exports = mongoose.model('Skill', skillSchema); 