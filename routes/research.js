const express = require('express');
const router = express.Router();
const Research = require('../models/Research');
const auth = require('../middleware/auth');
const multer = require('multer');
const path = require('path');
const cloudinary = require('../cloudinary'); // adjust path as needed

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

// Configure multer for research image uploads
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

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
router.post('/', auth, upload.single('image'), async (req, res) => {
    try {
        // Check if image file is uploaded
        if (!req.file) {
            return res.status(400).json({ error: 'Image is required' });
        }

        // Parse authors if it's a JSON string
        if (req.body.authors && typeof req.body.authors === 'string') {
            try {
                req.body.authors = JSON.parse(req.body.authors);
            } catch (error) {
                return res.status(400).json({ error: 'Invalid authors format' });
            }
        }

        // Upload image to Cloudinary first
        const imageUrl = await uploadToCloudinary(req.file.buffer, 'research');
        
        // Create research document with image URL
        const researchData = {
            ...req.body,
            image: imageUrl
        };
        
        const research = new Research(researchData);
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
        'type', 'title', 'description', 'authors', 'image',
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
router.put('/:id', auth, upload.single('image'), async (req, res) => {
    try {
        // Parse authors if it's a JSON string
        if (req.body.authors && typeof req.body.authors === 'string') {
            try {
                req.body.authors = JSON.parse(req.body.authors);
            } catch (error) {
                return res.status(400).json({ error: 'Invalid authors format' });
            }
        }

        const research = await Research.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );
        if (!research) {
            return res.status(404).json({ error: 'Research not found' });
        }
        if (req.file) {
            const imageUrl = await uploadToCloudinary(req.file.buffer, 'research');
            research.image = imageUrl;
            await research.save();
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