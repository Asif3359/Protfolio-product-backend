const express = require('express');
const router = express.Router();
const Skill = require('../models/Skill');
const auth = require('../middleware/auth');
const multer = require('multer');
const path = require('path');
const cloudinary = require('../cloudinary'); // adjust path as needed

// Configure multer for file uploads
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

function uploadToCloudinary(buffer, folder) {
  return new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      { folder },
      (error, result) => {
        if (error) return reject(error);
        resolve(result.secure_url);
      }
    );
    stream.end(buffer);
  });
}

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
router.post('/', auth, upload.single('logo'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: 'Logo is required.' });
        }
        const logoUrl = await uploadToCloudinary(req.file.buffer, 'skill_logos');
        const skill = new Skill({ ...req.body, logo: logoUrl });
        console.log('Skill:', skill);
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
router.patch('/:id', auth, upload.single('logo'), async (req, res) => {
    const updates = Object.keys(req.body);
    const allowedUpdates = ['name', 'category', 'proficiency', 'description', 'logo'];
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
        if (req.file) {
            skill.logo = await uploadToCloudinary(req.file.buffer, 'skill_logos');
        }
        else {
            const existing = await Skill.findById(req.params.id);
            if (!existing) {
                return res.status(404).json({ error: 'Skill not found' });
            }
            skill.logo = existing.logo;
        }
        updates.forEach(update => skill[update] = req.body[update]);
        await skill.save();
        res.json(skill);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

router.put('/:id', auth, upload.single('logo'), async (req, res) => {
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
        if (req.file) {
            skill.logo = await uploadToCloudinary(req.file.buffer, 'skill_logos');
        }
        else {
            const existing = await Skill.findById(req.params.id);
            if (!existing) {
                return res.status(404).json({ error: 'Skill not found' });
            }
            skill.logo = existing.logo;
        }
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