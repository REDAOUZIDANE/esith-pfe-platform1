import { Request, Response } from 'express';
import prisma from '../utils/prisma';
import { getIO } from '../utils/socket';

export const listCompanies = async (req: Request, res: Response) => {
    try {
        const companies = await prisma.company.findMany({
            include: { pfes: true }
        });
        res.json(companies);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching companies', error });
    }
};

export const createCompany = async (req: Request, res: Response) => {
    try {
        const { name, sector, industry, city, email, phone, website, contactPerson } = req.body;
        const company = await prisma.company.create({
            data: {
                name,
                sector: sector || industry || 'General',
                city: city || 'Unknown',
                email,
                phone,
                website,
                contactPerson
            }
        });

        const io = getIO();
        if (io) io.emit('new_company', company);

        res.status(201).json(company);
    } catch (error) {
        console.error('Create company error:', error);
        res.status(500).json({ message: 'Error creating company', error });
    }
};

export const getCompany = async (req: Request, res: Response) => {
    try {
        const id = String(req.params.id);
        const company = await prisma.company.findUnique({
            where: { id: parseInt(id) },
            include: { pfes: true }
        });
        if (!company) return res.status(404).json({ message: 'Company not found' });
        res.json(company);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching company', error });
    }
};

export const updateCompany = async (req: Request, res: Response) => {
    try {
        const id = String(req.params.id);
        const { name, sector, city, email, phone } = req.body;
        const company = await prisma.company.update({
            where: { id: parseInt(id) },
            data: { name, sector, city, email, phone }
        });
        res.json(company);
    } catch (error) {
        res.status(500).json({ message: 'Error updating company', error });
    }
};

export const deleteCompany = async (req: Request, res: Response) => {
    try {
        const id = String(req.params.id);
        await prisma.company.delete({ where: { id: parseInt(id) } });
        res.json({ message: 'Company deleted' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting company', error });
    }
};
