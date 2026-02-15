import { Request, Response } from 'express';
import prisma from '../utils/prisma';

export const getStats = async (req: Request, res: Response) => {
    try {
        const [pfes, companies, alumni, users] = await Promise.all([
            prisma.pFE.count(),
            prisma.company.count(),
            prisma.alumni.count(),
            prisma.user.count({ where: { role: 'STUDENT' } })
        ]);

        res.json({
            pfes,
            companies,
            alumni,
            students: users,
            // You can add more complex stats here later
        });
    } catch (error) {
        console.error('Error fetching dashboard stats:', error);
        res.status(500).json({ message: 'Server error' });
    }
};
