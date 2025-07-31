const express = require('express');
const router = express.Router();
const Profile = require('../models/Profile');
const auth = require('../middleware/auth');
const multer = require('multer');
const path = require('path');
const cloudinary = require('../cloudinary'); // adjust path as needed

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
    { name: 'heroPicture', maxCount: 1 },
    { name: 'backgroundImageForProfilePage', maxCount: 1 },
    { name: 'backgroundImageForExperiencePage', maxCount: 1 },
    { name: 'backgroundImageForProjectsPage', maxCount: 1 },
    { name: 'backgroundImageForSkillsPage', maxCount: 1 },
    { name: 'backgroundImageForEducationPage', maxCount: 1 },
    { name: 'backgroundImageForResearchPage', maxCount: 1 },
    { name: 'backgroundImageForAwardsPage', maxCount: 1 },
    { name: 'backgroundImageForCertificationsPage', maxCount: 1 },
]), async (req, res) => {
    try {
        
        const profileData = { ...req.body };

        // Handle file uploads with Cloudinary
        if (req.files) {
            if (req.files.profilePicture) {
                const result = await uploadToCloudinary(req.files.profilePicture[0].buffer, 'profile_pictures');
                profileData.profilePicture = result;
            }
            if (req.files.heroPicture) {
                const result = await uploadToCloudinary(req.files.heroPicture[0].buffer, 'hero_pictures');
                profileData.heroPicture = result;
            }
            if (req.files.backgroundImageForProfilePage) {
                const result = await uploadToCloudinary(req.files.backgroundImageForProfilePage[0].buffer, 'background_images');
                profileData.backgroundImageForProfilePage = result;
            }
            if (req.files.backgroundImageForExperiencePage) {
                const result = await uploadToCloudinary(req.files.backgroundImageForExperiencePage[0].buffer, 'background_images');
                profileData.backgroundImageForExperiencePage = result;
            }
            if (req.files.backgroundImageForProjectsPage) {
                const result = await uploadToCloudinary(req.files.backgroundImageForProjectsPage[0].buffer, 'background_images');
                profileData.backgroundImageForProjectsPage = result;
            }
            if (req.files.backgroundImageForSkillsPage) {
                const result = await uploadToCloudinary(req.files.backgroundImageForSkillsPage[0].buffer, 'background_images');
                profileData.backgroundImageForSkillsPage = result;
            }
            if (req.files.backgroundImageForEducationPage) {
                const result = await uploadToCloudinary(req.files.backgroundImageForEducationPage[0].buffer, 'background_images');
                profileData.backgroundImageForEducationPage = result;
            }
            if (req.files.backgroundImageForResearchPage) {
                const result = await uploadToCloudinary(req.files.backgroundImageForResearchPage[0].buffer, 'background_images');
                profileData.backgroundImageForResearchPage = result;
            }
            if (req.files.backgroundImageForAwardsPage) {
                const result = await uploadToCloudinary(req.files.backgroundImageForAwardsPage[0].buffer, 'background_images');
                profileData.backgroundImageForAwardsPage = result;
            }
            if (req.files.backgroundImageForCertificationsPage) {
                const result = await uploadToCloudinary(req.files.backgroundImageForCertificationsPage[0].buffer, 'background_images');
                profileData.backgroundImageForCertificationsPage = result;
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
    { name: 'heroPicture', maxCount: 1 },
    { name: 'backgroundImageForProfilePage', maxCount: 1 },
    { name: 'backgroundImageForExperiencePage', maxCount: 1 },
    { name: 'backgroundImageForProjectsPage', maxCount: 1 },
    { name: 'backgroundImageForSkillsPage', maxCount: 1 },
    { name: 'backgroundImageForEducationPage', maxCount: 1 },
    { name: 'backgroundImageForResearchPage', maxCount: 1 },
    { name: 'backgroundImageForAwardsPage', maxCount: 1 },
    { name: 'backgroundImageForCertificationsPage', maxCount: 1 },
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
            if (req.files.backgroundImageForProfilePage) {
                const result = await uploadToCloudinary(req.files.backgroundImageForProfilePage[0].buffer, 'background_images');
                profile.backgroundImageForProfilePage = result;
            }
            if (req.files.backgroundImageForExperiencePage) {
                const result = await uploadToCloudinary(req.files.backgroundImageForExperiencePage[0].buffer, 'background_images');
                profile.backgroundImageForExperiencePage = result;
            }
            if (req.files.backgroundImageForProjectsPage) {
                const result = await uploadToCloudinary(req.files.backgroundImageForProjectsPage[0].buffer, 'background_images');
                profile.backgroundImageForProjectsPage = result;
            }
            if (req.files.backgroundImageForSkillsPage) {
                const result = await uploadToCloudinary(req.files.backgroundImageForSkillsPage[0].buffer, 'background_images');
                profile.backgroundImageForSkillsPage = result;
            }
            if (req.files.backgroundImageForEducationPage) {
                const result = await uploadToCloudinary(req.files.backgroundImageForEducationPage[0].buffer, 'background_images');
                profile.backgroundImageForEducationPage = result;
            }
            if (req.files.backgroundImageForResearchPage) {
                const result = await uploadToCloudinary(req.files.backgroundImageForResearchPage[0].buffer, 'background_images');
                profile.backgroundImageForResearchPage = result;
            }
            if (req.files.backgroundImageForAwardsPage) {
                const result = await uploadToCloudinary(req.files.backgroundImageForAwardsPage[0].buffer, 'background_images');
                profile.backgroundImageForAwardsPage = result;
            }
            if (req.files.backgroundImageForCertificationsPage) {
                const result = await uploadToCloudinary(req.files.backgroundImageForCertificationsPage[0].buffer, 'background_images');
                profile.backgroundImageForCertificationsPage = result;
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
    { name: 'heroPicture', maxCount: 1 },
    { name: 'backgroundImageForProfilePage', maxCount: 1 },
    { name: 'backgroundImageForExperiencePage', maxCount: 1 },
    { name: 'backgroundImageForProjectsPage', maxCount: 1 },
    { name: 'backgroundImageForSkillsPage', maxCount: 1 },
    { name: 'backgroundImageForEducationPage', maxCount: 1 },
    { name: 'backgroundImageForResearchPage', maxCount: 1 },
    { name: 'backgroundImageForAwardsPage', maxCount: 1 },
    { name: 'backgroundImageForCertificationsPage', maxCount: 1 },

]), async (req, res) => {
    try {
        
        const profileData = { ...req.body };

        // Handle file uploads with Cloudinary
        if (req.files) {
            if (req.files.profilePicture) {
                const result = await uploadToCloudinary(req.files.profilePicture[0].buffer, 'profile_pictures');
                profileData.profilePicture = result;
            }
            if (req.files.heroPicture) {
                const result = await uploadToCloudinary(req.files.heroPicture[0].buffer, 'hero_pictures');
                profileData.heroPicture = result;
            }
            if (req.files.backgroundImageForProfilePage) {
                const result = await uploadToCloudinary(req.files.backgroundImageForProfilePage[0].buffer, 'background_images');
                profileData.backgroundImageForProfilePage = result;
            }
            if (req.files.backgroundImageForExperiencePage) {
                const result = await uploadToCloudinary(req.files.backgroundImageForExperiencePage[0].buffer, 'background_images');
                profileData.backgroundImageForExperiencePage = result;
            }
            if (req.files.backgroundImageForProjectsPage) {
                const result = await uploadToCloudinary(req.files.backgroundImageForProjectsPage[0].buffer, 'background_images');
                profileData.backgroundImageForProjectsPage = result;
            }
            if (req.files.backgroundImageForSkillsPage) {
                const result = await uploadToCloudinary(req.files.backgroundImageForSkillsPage[0].buffer, 'background_images');
                profileData.backgroundImageForSkillsPage = result;
            }
            if (req.files.backgroundImageForEducationPage) {
                const result = await uploadToCloudinary(req.files.backgroundImageForEducationPage[0].buffer, 'background_images');
                profileData.backgroundImageForEducationPage = result;
            }
            if (req.files.backgroundImageForResearchPage) {
                const result = await uploadToCloudinary(req.files.backgroundImageForResearchPage[0].buffer, 'background_images');
                profileData.backgroundImageForResearchPage = result;
            }
            if (req.files.backgroundImageForAwardsPage) {
                const result = await uploadToCloudinary(req.files.backgroundImageForAwardsPage[0].buffer, 'background_images');
                profileData.backgroundImageForAwardsPage = result;
            }
            if (req.files.backgroundImageForCertificationsPage) {
                const result = await uploadToCloudinary(req.files.backgroundImageForCertificationsPage[0].buffer, 'background_images');
                profileData.backgroundImageForCertificationsPage = result;
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