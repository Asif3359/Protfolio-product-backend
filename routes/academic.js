const express = require('express');
const router = express.Router();
const Academic = require('../models/Academic');
const auth = require('../middleware/auth');

// Get all academics
router.get('/', async (req, res) => {
    try {
        const academics = await Academic.find().sort({ startDate: -1 });
        res.json(academics);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Create academic
router.post('/', auth, async (req, res) => {
    try {
        const academic = new Academic(req.body);
        await academic.save();
        res.status(201).json(academic);
    } catch (error) {
        console.error('Academic creation error:', error); // Add this line
        res.status(400).json({ error: error.message });
    }
});

// Get academic by id
router.get('/:id', async (req, res) => {
    try {
        const academic = await Academic.findById(req.params.id);
        if (!academic) {
            return res.status(404).json({ error: 'Academic not found' });
        }
        res.json(academic);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Update academic
router.patch('/:id', auth, async (req, res) => {
    const updates = Object.keys(req.body);
    const allowedUpdates = ['degree', 'institution', 'field', 'startDate', 'endDate', 'description', 'achievements', 'gpa'];
    const isValidOperation = updates.every(update => allowedUpdates.includes(update));

    if (!isValidOperation) {
        return res.status(400).json({ error: 'Invalid updates!' });
    }

    try {
        const academic = await Academic.findById(req.params.id);
        if (!academic) {
            return res.status(404).json({ error: 'Academic not found' });
        }

        updates.forEach(update => academic[update] = req.body[update]);
        await academic.save();
        res.json(academic);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

router.put('/:id', auth, async (req, res) => {
    try {
        const academic = await Academic.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );
        if (!academic) {
            return res.status(404).json({ error: 'Academic not found' });
        }
        res.json(academic);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});


// Delete academic
router.delete('/:id', auth, async (req, res) => {
    try {
        const academic = await Academic.findByIdAndDelete(req.params.id);
        if (!academic) {
            return res.status(404).json({ error: 'Academic not found' });
        }
        res.json(academic);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;