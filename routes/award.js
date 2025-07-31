const express = require('express');
const router = express.Router();
const Award = require('../models/Award');
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
router.post('/', auth, upload.single('image'), async (req, res) => {
    try {
        const award = new Award(req.body);
        if (req.file) {
            const imageUrl = await uploadToCloudinary(req.file.buffer, 'awards');
            award.image = imageUrl;
        }
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
router.patch('/:id', auth, upload.single('image'), async (req, res) => {
    const updates = Object.keys(req.body);
    const allowedUpdates = ['title', 'issuer', 'date', 'description', 'category', 'link', 'image'];
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
        if (req.file) {
            const imageUrl = await uploadToCloudinary(req.file.buffer, 'awards');
            award.image = imageUrl;
        }
        await award.save();
        res.json(award);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Update award (PUT)
router.put('/:id', auth, upload.single('image'), async (req, res) => {
    try {
        let updateData = req.body;
        // If req.file exists, upload and set image
        if (req.file) {
            const imageUrl = await uploadToCloudinary(req.file.buffer, 'awards');
            updateData.image = imageUrl;
        }
        const award = await Award.findByIdAndUpdate(
            req.params.id,
            updateData,
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