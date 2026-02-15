import { Router } from 'express';
import { createAlumni, listAlumni, updateAlumni, deleteAlumni } from '../controllers/alumni.controller';
import { authenticateToken, authorizeAdmin } from '../middleware/auth.middleware';

const router = Router();

router.get('/', authenticateToken, listAlumni);
router.post('/', authenticateToken, createAlumni);
router.put('/:id', authenticateToken, authorizeAdmin, updateAlumni);
router.delete('/:id', authenticateToken, authorizeAdmin, deleteAlumni);

export default router;
