const express = require('express');
const router = express.Router();
const Research = require('../models/Research');
const auth = require('../middleware/auth');

// Get all research works
router.get('/', async (req, res) => {
    try {
        const { type } = req.query;
        const query = type ? { type } : {};
        const research = await Research.find(query).sort({ publicationDate: -1 });
        res.json(research);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Create research work
router.post('/', auth, async (req, res) => {
    try {
        const research = new Research(req.body);
        await research.save();
        res.status(201).json(research);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Get research by id
router.get('/:id', async (req, res) => {
    try {
        const research = await Research.findById(req.params.id);
        if (!research) {
            return res.status(404).json({ error: 'Research not found' });
        }
        res.json(research);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Update research
router.patch('/:id', auth, async (req, res) => {
    const updates = Object.keys(req.body);
    const allowedUpdates = [
        'type', 'title', 'description', 'authors',
        'publicationDate', 'journal', 'doi', 'link', 'status'
    ];
    const isValidOperation = updates.every(update => allowedUpdates.includes(update));

    if (!isValidOperation) {
        return res.status(400).json({ error: 'Invalid updates!' });
    }

    try {
        const research = await Research.findById(req.params.id);
        if (!research) {
            return res.status(404).json({ error: 'Research not found' });
        }

        updates.forEach(update => research[update] = req.body[update]);
        await research.save();
        res.json(research);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Update research (PUT)
router.put('/:id', auth, async (req, res) => {
    try {
        const research = await Research.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );
        if (!research) {
            return res.status(404).json({ error: 'Research not found' });
        }
        res.json(research);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Delete research
router.delete('/:id', auth, async (req, res) => {
    try {
        const research = await Research.findByIdAndDelete(req.params.id);
        if (!research) {
            return res.status(404).json({ error: 'Research not found' });
        }
        res.json(research);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;