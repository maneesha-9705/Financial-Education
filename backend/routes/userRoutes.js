import express from 'express';
const router = express.Router();
import {
    authUser,
    registerUser,
    getUserProfile,
    updateUserProfile,
    getUsers
} from '../controllers/userController.js';
import { protect } from '../middleware/authMiddleware.js';

router.post('/register', registerUser);
router.post('/login', authUser);
router.route('/users').get(protect, getUsers);
router
    .route('/users/:id')
    .get(protect, getUserProfile)
    .patch(protect, updateUserProfile);

export default router;
