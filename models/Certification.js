const mongoose = require('mongoose');

const certificationSchema = new mongoose.Schema({
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
    expiryDate: Date,
    credentialId: String,
    credentialUrl: String,
    description: String,
    ownerEmail: { type: String, required: true },
}, { timestamps: true });

module.exports = mongoose.model('Certification', certificationSchema); 