const express = require('express');
const router = express.Router();
const Skill = require('../models/Skill');
const auth = require('../middleware/auth');

// Get all skills
router.get('/', async (req, res) => {
    try {
        const { category } = req.query;
        const query = category ? { category } : {};
        const skills = await Skill.find(query).sort({ category: 1, name: 1 });
        res.json(skills);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Create skill
router.post('/', auth, async (req, res) => {
    try {
        const skill = new Skill(req.body);
        await skill.save();
        res.status(201).json(skill);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Get skill by id
router.get('/:id', async (req, res) => {
    try {
        const skill = await Skill.findById(req.params.id);
        if (!skill) {
            return res.status(404).json({ error: 'Skill not found' });
        }
        res.json(skill);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Update skill
router.patch('/:id', auth, async (req, res) => {
    const updates = Object.keys(req.body);
    const allowedUpdates = ['name', 'category', 'proficiency', 'description'];
    const isValidOperation = updates.every(update => allowedUpdates.includes(update));

    if (!isValidOperation) {
        return res.status(400).json({ error: 'Invalid updates!' });
    }

    try {
        const skill = await Skill.findById(req.params.id);
        if (!skill) {
            return res.status(404).json({ error: 'Skill not found' });
        }

        updates.forEach(update => skill[update] = req.body[update]);
        await skill.save();
        res.json(skill);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});
router.put('/:id', auth, async (req, res) => {
    try {
        const skill = await Skill.findById(req.params.id);
        if (!skill) {
            return res.status(404).json({ error: 'Skill not found' });
        }
        // Overwrite all updatable fields
        skill.name = req.body.name;
        skill.category = req.body.category;
        skill.proficiency = req.body.proficiency;
        skill.description = req.body.description;
        skill.ownerEmail = req.body.ownerEmail;
        await skill.save();
        res.json(skill);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Delete skill
router.delete('/:id', auth, async (req, res) => {
    try {
        const skill = await Skill.findByIdAndDelete(req.params.id);
        if (!skill) {
            return res.status(404).json({ error: 'Skill not found' });
        }
        res.json(skill);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router; 