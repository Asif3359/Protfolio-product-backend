const express = require('express');
const router = express.Router();
const Experience = require('../models/Experience');
const auth = require('../middleware/auth');

// Get all experiences
router.get('/', async (req, res) => {
    try {
        const experiences = await Experience.find().sort({ startDate: -1 });
        res.json(experiences);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Create experience
router.post('/', auth, async (req, res) => {
    try {
        const experience = new Experience(req.body);
        await experience.save();
        res.status(201).json(experience);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Get experience by id
router.get('/:id', async (req, res) => {
    try {
        const experience = await Experience.findById(req.params.id);
        if (!experience) {
            return res.status(404).json({ error: 'Experience not found' });
        }
        res.json(experience);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// Update experience
router.patch('/:id', auth, async (req, res) => {
    const updates = Object.keys(req.body);
    const allowedUpdates = [
        'title', 'company', 'location', 'startDate',
        'endDate', 'isCurrent', 'description',
        'responsibilities', 'achievements', 'technologies'
    ];
    const isValidOperation = updates.every(update => allowedUpdates.includes(update));

    if (!isValidOperation) {
        return res.status(400).json({ error: 'Invalid updates!' });
    }

    try {
        const experience = await Experience.findById(req.params.id);
        if (!experience) {
            return res.status(404).json({ error: 'Experience not found' });
        }

        updates.forEach(update => experience[update] = req.body[update]);
        await experience.save();
        res.json(experience);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Helper to ensure arrays are always arrays of strings
function ensureArray(val) {
    if (Array.isArray(val)) return val;
    if (typeof val === "string" && val.startsWith("[") && val.endsWith("]")) {
      try {
        const parsed = JSON.parse(val);
        return Array.isArray(parsed) ? parsed : [val];
      } catch {
        return [val];
      }
    }
    if (val !== undefined && val !== null) return [val];
    return [];
  }
  
  router.put('/:id', auth, async (req, res) => {
    try {
      const updateData = { ...req.body };
  
      // Defensive: Always ensure arrays
      updateData.responsibilities = ensureArray(updateData.responsibilities);
      updateData.achievements = ensureArray(updateData.achievements);
      updateData.technologies = ensureArray(updateData.technologies);
  
      // Defensive: Convert dates
      if (updateData.startDate) updateData.startDate = new Date(updateData.startDate);
      if (updateData.endDate) updateData.endDate = new Date(updateData.endDate);
  
      // Defensive: Check required fields
      const requiredFields = ['title', 'company', 'startDate', 'description', 'ownerEmail'];
      for (const field of requiredFields) {
        if (
          updateData[field] === undefined ||
          updateData[field] === "" ||
          (Array.isArray(updateData[field]) && updateData[field].length === 0)
        ) {
          return res.status(400).json({ error: `Field '${field}' is required.` });
        }
      }
  
      const experience = await Experience.findByIdAndUpdate(req.params.id, updateData, { new: true, runValidators: true });
      if (!experience) {
        return res.status(404).json({ error: 'Experience not found' });
      }
      res.json(experience);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  });

// Delete experience
router.delete('/:id', auth, async (req, res) => {
    try {
        const experience = await Experience.findByIdAndDelete(req.params.id);
        if (!experience) {
            return res.status(404).json({ error: 'Experience not found' });
        }
        res.json(experience);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;