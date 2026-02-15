import { Router } from 'express';
import { listPFEs, createPFE, getPFE, updatePFE, deletePFE } from '../controllers/pfe.controller';
import { authenticateToken, authorizeAdmin } from '../middleware/auth.middleware';
import { upload } from '../middleware/upload.middleware';

const router = Router();

router.get('/', listPFEs);
router.post('/', authenticateToken, upload.fields([{ name: 'report', maxCount: 1 }, { name: 'presentation', maxCount: 1 }]), createPFE);
router.get('/:id', getPFE);
router.put('/:id', authenticateToken, authorizeAdmin, upload.fields([{ name: 'report', maxCount: 1 }, { name: 'presentation', maxCount: 1 }]), updatePFE);
router.delete('/:id', authenticateToken, authorizeAdmin, deletePFE);

export default router;
