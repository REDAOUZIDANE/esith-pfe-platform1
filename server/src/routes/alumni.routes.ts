import { Router } from 'express';
import { createAlumni, listAlumni, updateAlumni, deleteAlumni } from '../controllers/alumni.controller';
import { authenticateToken } from '../middleware/auth.middleware';

const router = Router();

router.get('/', authenticateToken, listAlumni);
router.post('/', authenticateToken, createAlumni);
router.put('/:id', authenticateToken, updateAlumni);
router.delete('/:id', authenticateToken, deleteAlumni);

export default router;
