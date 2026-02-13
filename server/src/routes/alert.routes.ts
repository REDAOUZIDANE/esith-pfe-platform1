import { Router } from 'express';
import { listAlerts, createAlert, deactivateAlert } from '../controllers/alert.controller';
import { authenticateToken } from '../middleware/auth.middleware';

const router = Router();

router.get('/', authenticateToken, listAlerts);
router.post('/', authenticateToken, createAlert);
router.patch('/:id/deactivate', authenticateToken, deactivateAlert);

export default router;
