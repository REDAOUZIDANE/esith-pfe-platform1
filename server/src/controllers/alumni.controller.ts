import { Request, Response } from 'express';
import prisma from '../utils/prisma';

export const listAlumni = async (req: Request, res: Response) => {
    try {
        const alumni = await prisma.alumni.findMany();
        res.json(alumni);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching alumni', error });
    }
};

export const createAlumni = async (req: Request, res: Response) => {
    try {
        const { name, graduationYear, major, currentCompany, email, linkedIn } = req.body;
        const alumni = await prisma.alumni.create({
            data: {
                name,
                graduationYear: graduationYear.toString(),
                major,
                currentCompany,
                email,
                linkedIn
            }
        });
        res.status(201).json(alumni);
    } catch (error) {
        console.error('Create Alumni Error:', error);
        res.status(500).json({ message: 'Error creating alumni', error });
    }
};

export const getAlumni = async (req: Request, res: Response) => {
    try {
        const id = String(req.params.id);
        const alumni = await prisma.alumni.findUnique({
            where: { id: parseInt(id) }
        });
        if (!alumni) return res.status(404).json({ message: 'Alumni not found' });
        res.json(alumni);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching alumni', error });
    }
};

export const updateAlumni = async (req: Request, res: Response) => {
    try {
        const id = String(req.params.id);
        const { name, graduationYear, major, currentCompany, email, linkedIn } = req.body;
        const alumni = await prisma.alumni.update({
            where: { id: parseInt(id) },
            data: { name, graduationYear, major, currentCompany, email, linkedIn }
        });
        res.json(alumni);
    } catch (error) {
        res.status(500).json({ message: 'Error updating alumni', error });
    }
};

export const deleteAlumni = async (req: Request, res: Response) => {
    try {
        const id = String(req.params.id);
        await prisma.alumni.delete({ where: { id: parseInt(id) } });
        res.json({ message: 'Alumni deleted' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting alumni', error });
    }
};
