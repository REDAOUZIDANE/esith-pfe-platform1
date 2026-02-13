import { Request, Response } from 'express';
import prisma from '../utils/prisma';

export const listAlerts = async (req: Request, res: Response) => {
    try {
        const { role } = req.query;
        const alerts = await prisma.alert.findMany({
            where: {
                active: true,
                OR: [
                    { target: 'ALL' },
                    { target: role as string }
                ]
            },
            orderBy: { createdAt: 'desc' }
        });
        res.json(alerts);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching alerts', error });
    }
};

export const createAlert = async (req: Request, res: Response) => {
    try {
        const { type, title, content, target } = req.body;
        const alert = await prisma.alert.create({
            data: { type, title, content, target }
        });
        res.status(201).json(alert);
    } catch (error) {
        res.status(500).json({ message: 'Error creating alert', error });
    }
};

export const deactivateAlert = async (req: Request, res: Response) => {
    try {
        const { id } = req.params;
        await prisma.alert.update({
            where: { id: parseInt(id as string) },
            data: { active: false }
        });
        res.json({ message: 'Alert deactivated' });
    } catch (error) {
        res.status(500).json({ message: 'Error deactivating alert', error });
    }
};
