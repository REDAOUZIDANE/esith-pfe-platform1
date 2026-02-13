import { Router } from 'express';
import { createCompany, listCompanies, updateCompany, deleteCompany } from '../controllers/company.controller';
import { authenticateToken } from '../middleware/auth.middleware';

const router = Router();

router.get('/', authenticateToken, listCompanies);
router.post('/', authenticateToken, createCompany);
router.put('/:id', authenticateToken, updateCompany);
router.delete('/:id', authenticateToken, deleteCompany);

export default router;
