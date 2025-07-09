const express = require('express');
const router = express.Router();
const Profile = require('../models/Profile');
const auth = require('../middleware/auth');
const multer = require('multer');
const path = require('path');


// Configure multer for file uploads
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'public/uploads/')
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname))
    }
});

const upload = multer({ storage: storage });

// Get profile
router.get('/', async (req, res) => {
    try {
        
        const profile = await Profile.findOne();
        res.json(profile);
    } catch (error) {
        console.error('Profile GET error:', error);
        res.status(500).json({ error: error.message });
    }
});
router.post('/', auth, upload.fields([
    { name: 'profilePicture', maxCount: 1 },
    { name: 'heroPicture', maxCount: 1 }
]), async (req, res) => {
    try {
        
        const profileData = { ...req.body };

        // Handle file uploads
        if (req.files) {
            if (req.files.profilePicture) {
                profileData.profilePicture = '/uploads/' + req.files.profilePicture[0].filename;
            }
            if (req.files.heroPicture) {
                profileData.heroPicture = '/uploads/' + req.files.heroPicture[0].filename;
            }
        }

        // Defensive: Parse nested objects if sent as JSON strings (common with FormData)
        if (typeof profileData.socialMedia === "string") {
            try { profileData.socialMedia = JSON.parse(profileData.socialMedia); } catch {}
        }
        if (typeof profileData.contact === "string") {
            try { profileData.contact = JSON.parse(profileData.contact); } catch {}
        }
        if (typeof profileData.bestThreeWords === "string") {
            try { profileData.bestThreeWords = JSON.parse(profileData.bestThreeWords); } catch {}
        }

        let profile = await Profile.findOne();
        if (profile) {
            Object.assign(profile, profileData);
            await profile.save();
        } else {
            profile = new Profile(profileData);
            await profile.save();
        }

        res.status(201).json(profile);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Update profile
router.patch('/', auth, upload.fields([
    { name: 'profilePicture', maxCount: 1 },
    { name: 'heroPicture', maxCount: 1 }
]), async (req, res) => {
    const updates = Object.keys(req.body);
    const allowedUpdates = [
        'heroTitle', 'heroDescription', 'bestThreeWords',
        'aboutMe', 'currentJobTitle', 'socialMedia',
        'contact'
    ];
    const isValidOperation = updates.every(update => allowedUpdates.includes(update));

    if (!isValidOperation) {
        return res.status(400).json({ error: 'Invalid updates!' });
    }

    try {
        const profile = await Profile.findOne();
        if (!profile) {
            return res.status(404).json({ error: 'Profile not found' });
        }

        if (req.files) {
            if (req.files.profilePicture) {
                profile.profilePicture = '/uploads/' + req.files.profilePicture[0].filename;
            }
            if (req.files.heroPicture) {
                profile.heroPicture = '/uploads/' + req.files.heroPicture[0].filename;
            }
        }

        updates.forEach(update => profile[update] = req.body[update]);
        await profile.save();
        res.json(profile);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});
// Update profile with PUT
router.put('/', auth, upload.fields([
    { name: 'profilePicture', maxCount: 1 },
    { name: 'heroPicture', maxCount: 1 }
]), async (req, res) => {
    try {
        const profileData = { ...req.body };

        // Handle file uploads
        if (req.files) {
            if (req.files.profilePicture) {
                profileData.profilePicture = '/uploads/' + req.files.profilePicture[0].filename;
            }
            if (req.files.heroPicture) {
                profileData.heroPicture = '/uploads/' + req.files.heroPicture[0].filename;
            }
        }

        // Defensive: Parse nested objects if sent as JSON strings (common with FormData)
        if (typeof profileData.socialMedia === "string") {
            try { profileData.socialMedia = JSON.parse(profileData.socialMedia); } catch {}
        }
        if (typeof profileData.contact === "string") {
            try { profileData.contact = JSON.parse(profileData.contact); } catch {}
        }
        if (typeof profileData.bestThreeWords === "string") {
            try { profileData.bestThreeWords = JSON.parse(profileData.bestThreeWords); } catch {}
        }

        let profile = await Profile.findOne();
        if (profile) {
            Object.assign(profile, profileData);
            await profile.save();
        } else {
            profile = new Profile(profileData);
            await profile.save();
        }

        res.status(201).json(profile);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

module.exports = router; 