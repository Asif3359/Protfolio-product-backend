const express = require('express');
const router = express.Router();
const Award = require('../models/Award');
const auth = require('../middleware/auth');

// Get all awards
router.get('/', async (req, res) => {
    try {
        const { category } = req.query;
        const query = category ? { category } : {};
        const awards = await Award.find(query).sort({ date: -1 });
        res.json(awards);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Create award
router.post('/', auth, async (req, res) => {
    try {
        const award = new Award(req.body);
        await award.save();
        res.status(201).json(award);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Get award by id
router.get('/:id', async (req, res) => {
    try {
        const award = await Award.findById(req.params.id);
        if (!award) {
            return res.status(404).json({ error: 'Award not found' });
        }
        res.json(award);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Update award
router.patch('/:id', auth, async (req, res) => {
    const updates = Object.keys(req.body);
    const allowedUpdates = ['title', 'issuer', 'date', 'description', 'category', 'link'];
    const isValidOperation = updates.every(update => allowedUpdates.includes(update));

    if (!isValidOperation) {
        return res.status(400).json({ error: 'Invalid updates!' });
    }

    try {
        const award = await Award.findById(req.params.id);
        if (!award) {
            return res.status(404).json({ error: 'Award not found' });
        }

        updates.forEach(update => award[update] = req.body[update]);
        await award.save();
        res.json(award);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Update award (PUT)
router.put('/:id', auth, async (req, res) => {
    try {
        const award = await Award.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );
        if (!award) {
            return res.status(404).json({ error: 'Award not found' });
        }
        res.json(award);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Delete award
router.delete('/:id', auth, async (req, res) => {
    try {
        const award = await Award.findByIdAndDelete(req.params.id);
        if (!award) {
            return res.status(404).json({ error: 'Award not found' });
        }
        res.json(award);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router; 