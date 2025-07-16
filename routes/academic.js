const express = require('express');
const router = express.Router();
const Academic = require('../models/Academic');
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
router.post('/', auth, upload.single('logo'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).json({ error: 'Logo is required.' });
        }
        const logoUrl = await uploadToCloudinary(req.file.buffer, 'academic_logos');
        const academic = new Academic({ ...req.body, logo: logoUrl });
        await academic.save();
        res.status(201).json(academic);
    } catch (error) {
        console.error('Academic creation error:', error);
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
router.patch('/:id', auth, upload.single('logo'), async (req, res) => {
    const updates = Object.keys(req.body);
    const allowedUpdates = ['degree', 'institution', 'field', 'startDate', 'endDate', 'description', 'achievements', 'gpa', 'logo'];
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

// router.put('/:id', auth, upload.single('logo'), async (req, res) => {
//     try {
//         const academic = await Academic.findByIdAndUpdate(
//             req.params.id,
//             req.body,
//             { new: true, runValidators: true }
//         );
//         if (!academic) {
//             return res.status(404).json({ error: 'Academic not found' });
//         }
//         if (req.file) {
//             const logoUrl = await uploadToCloudinary(req.file.buffer, 'academic_logos');
//             academic.logo = logoUrl;
//             await academic.save();
//         }
//         res.json(academic);
//     } catch (error) {
//         res.status(400).json({ error: error.message });
//     }
// });


router.put('/:id', auth, upload.single('logo'), async (req, res) => {
    try {
        let updateData = { ...req.body };
        // console.log('Incoming updateData:', updateData);

        // Sanitize gpa
        if (updateData.gpa === "null" || updateData.gpa === "" || updateData.gpa === undefined) {
            updateData.gpa = null;
        } else if (typeof updateData.gpa === "string") {
            updateData.gpa = Number(updateData.gpa);
        }

        if (req.file) {
            const logoUrl = await uploadToCloudinary(req.file.buffer, 'academic_logos');
            updateData.logo = logoUrl;
        } else {
            const existing = await Academic.findById(req.params.id);
            if (!existing) {
                return res.status(404).json({ error: 'Academic not found' });
            }
            updateData.logo = existing.logo;
        }

        const academic = await Academic.findByIdAndUpdate(
            req.params.id,
            updateData,
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