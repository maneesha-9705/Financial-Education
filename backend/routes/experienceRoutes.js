import express from 'express';
import Experience from '../models/Experience.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// @desc    Get all experiences
router.get('/', async (req, res) => {
    try {
        const experiences = await Experience.find({}).sort({ createdAt: -1 });
        res.json(experiences);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @desc    Create a new experience
router.post('/', protect, async (req, res) => {
    try {
        const { message, role } = req.body;
        const experience = await Experience.create({
            user: req.user._id,
            name: req.user.name,
            message,
            role: role || 'Member'
        });
        res.status(201).json(experience);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

export default router;
