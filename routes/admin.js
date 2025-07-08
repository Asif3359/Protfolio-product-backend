const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const Admin = require('../models/Admin');
const auth = require('../middleware/auth');

// Register admin
router.post('/register', async (req, res) => {
    try {
        const admin = new Admin(req.body);
        await admin.save();
        const token = jwt.sign({ _id: admin._id }, process.env.JWT_SECRET);
        res.status(201).json({ admin, token });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Login admin
router.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body;
        const admin = await Admin.findOne({ username });
        
        if (!admin || !(await admin.comparePassword(password))) {
            throw new Error('Invalid login credentials');
        }

        const token = jwt.sign({ _id: admin._id }, process.env.JWT_SECRET);
        res.json({ admin, token });
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

// Get admin profile
router.get('/profile', auth, async (req, res) => {
    res.json(req.admin);
});

// Update admin profile
router.patch('/profile', auth, async (req, res) => {
    const updates = Object.keys(req.body);
    const allowedUpdates = ['username', 'email', 'password'];
    const isValidOperation = updates.every(update => allowedUpdates.includes(update));

    if (!isValidOperation) {
        return res.status(400).json({ error: 'Invalid updates!' });
    }

    try {
        updates.forEach(update => req.admin[update] = req.body[update]);
        await req.admin.save();
        res.json(req.admin);
    } catch (error) {
        res.status(400).json({ error: error.message });
    }
});

module.exports = router; 