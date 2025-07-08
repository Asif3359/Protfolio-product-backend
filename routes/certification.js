const express = require('express');
const router = express.Router();
const Certification = require('../models/Certification');
const auth = require('../middleware/auth');

// Get all certifications
router.get('/', async (req, res) => {
    try {
        const certifications = await Certification.find().sort({ date: -1 });
        res.json(certifications);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Create certification
router.post('/', auth, async (req, res) => {
    try {
        const certification = new Certification(req.body);
        await certification.save();
        res.status(201).json(certification);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Get certification by id
router.get('/:id', async (req, res) => {
    try {
        const certification = await Certification.findById(req.params.id);
        if (!certification) {
            return res.status(404).json({ error: 'Certification not found' });
        }
        res.json(certification);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Update certification
router.patch('/:id', auth, async (req, res) => {
    const updates = Object.keys(req.body);
    const allowedUpdates = [
        'title', 'issuer', 'date', 'expiryDate',
        'credentialId', 'credentialUrl', 'description'
    ];
    const isValidOperation = updates.every(update => allowedUpdates.includes(update));

    if (!isValidOperation) {
        return res.status(400).json({ error: 'Invalid updates!' });
    }

    try {
        const certification = await Certification.findById(req.params.id);
        if (!certification) {
            return res.status(404).json({ error: 'Certification not found' });
        }

        updates.forEach(update => certification[update] = req.body[update]);
        await certification.save();
        res.json(certification);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Update certification (PUT)
router.put('/:id', auth, async (req, res) => {
    try {
        const certification = await Certification.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );
        if (!certification) {
            return res.status(404).json({ error: 'Certification not found' });
        }
        res.json(certification);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});
// Delete certification
router.delete('/:id', auth, async (req, res) => {
    try {
        const certification = await Certification.findByIdAndDelete(req.params.id);
        if (!certification) {
            return res.status(404).json({ error: 'Certification not found' });
        }
        res.json(certification);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router; 