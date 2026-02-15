import { Router } from 'express';
import { createCompany, listCompanies, updateCompany, deleteCompany } from '../controllers/company.controller';
import { authenticateToken, authorizeAdmin } from '../middleware/auth.middleware';

const router = Router();

router.get('/', authenticateToken, listCompanies);
router.post('/', authenticateToken, createCompany);
router.put('/:id', authenticateToken, authorizeAdmin, updateCompany);
router.delete('/:id', authenticateToken, authorizeAdmin, deleteCompany);

export default router;
