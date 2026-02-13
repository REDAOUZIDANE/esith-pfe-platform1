import { Request, Response } from 'express';
import prisma from '../utils/prisma';
import { getIO } from '../utils/socket';

export const listPFEs = async (req: Request, res: Response) => {
    try {
        const pfes = await prisma.pFE.findMany({
            include: { company: true }
        });
        res.json(pfes);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching PFEs', error });
    }
};

export const createPFE = async (req: Request, res: Response) => {
    try {
        const { title, description, academicYear, major, studentNames, students, companyId } = req.body;
        const files = req.files as { [fieldname: string]: Express.Multer.File[] } | undefined;

        const reportUrl = files && files['report'] ? `/uploads/${files['report'][0].filename}` : null;
        const presentationUrl = files && files['presentation'] ? `/uploads/${files['presentation'][0].filename}` : null;

        const pfe = await prisma.pFE.create({
            data: {
                title: title || 'Untitled Project',
                description: description || '',
                academicYear: academicYear || new Date().getFullYear().toString(),
                major: major || 'General',
                studentNames: studentNames || students || 'Unknown',
                reportUrl,
                presentationUrl,
                companyId: companyId ? parseInt(companyId) : null
            }
        });

        // Notify real-time
        const io = getIO();
        if (io) io.emit('new_pfe', pfe);

        res.status(201).json(pfe);
    } catch (error) {
        console.error('Create PFE error:', error);
        res.status(500).json({ message: 'Error creating PFE', error });
    }
};

export const getPFE = async (req: Request, res: Response) => {
    try {
        const id = String(req.params.id);
        const pfe = await prisma.pFE.findUnique({
            where: { id: parseInt(id) },
            include: { company: true }
        });
        if (!pfe) return res.status(404).json({ message: 'PFE not found' });
        res.json(pfe);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching PFE', error });
    }
};

export const updatePFE = async (req: Request, res: Response) => {
    try {
        const id = String(req.params.id);
        const { title, description, academicYear, major, studentNames, companyId } = req.body;
        const files = req.files as { [fieldname: string]: Express.Multer.File[] };

        const updateData: any = { title, description, academicYear, major, studentNames };
        if (companyId) updateData.companyId = parseInt(companyId);

        if (files) {
            if (files['report']) updateData.reportUrl = `/uploads/${files['report'][0].filename}`;
            if (files['presentation']) updateData.presentationUrl = `/uploads/${files['presentation'][0].filename}`;
        }

        const pfe = await prisma.pFE.update({
            where: { id: parseInt(id) },
            data: updateData
        });
        res.json(pfe);
    } catch (error) {
        res.status(500).json({ message: 'Error updating PFE', error });
    }
};

export const deletePFE = async (req: Request, res: Response) => {
    try {
        const id = String(req.params.id);
        await prisma.pFE.delete({ where: { id: parseInt(id) } });
        res.json({ message: 'PFE deleted' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting PFE', error });
    }
};
