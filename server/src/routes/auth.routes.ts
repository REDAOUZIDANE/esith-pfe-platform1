import { Router } from 'express';
import { register, login, getMe, updateProfile, forgotPassword, resetPassword, changePassword } from '../controllers/auth.controller';
import { authenticateToken } from '../middleware/auth.middleware';
import { upload } from '../middleware/upload.middleware';

const router = Router();

router.post('/register', register);
router.post('/login', login);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);
router.get('/me', authenticateToken, getMe);
router.put('/profile', authenticateToken, upload.single('profileImage'), updateProfile);
router.post('/change-password', authenticateToken, changePassword);

// Admin routes
import { listUsers, deleteUser, updateUserRole } from '../controllers/auth.controller';
import { authorizeAdmin } from '../middleware/auth.middleware';

router.get('/users', authenticateToken, authorizeAdmin, listUsers);
router.delete('/users/:id', authenticateToken, authorizeAdmin, deleteUser);
router.put('/users/:id/role', authenticateToken, authorizeAdmin, updateUserRole);

export default router;
