"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteCompany = exports.updateCompany = exports.getCompany = exports.createCompany = exports.listCompanies = void 0;
const prisma_1 = __importDefault(require("../utils/prisma"));
const socket_1 = require("../utils/socket");
const listCompanies = async (req, res) => {
    try {
        const companies = await prisma_1.default.company.findMany({
            include: { pfes: true }
        });
        res.json(companies);
    }
    catch (error) {
        res.status(500).json({ message: 'Error fetching companies', error });
    }
};
exports.listCompanies = listCompanies;
const createCompany = async (req, res) => {
    try {
        const { name, sector, industry, city, email, phone, website, contactPerson } = req.body;
        const company = await prisma_1.default.company.create({
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
        const io = (0, socket_1.getIO)();
        if (io)
            io.emit('new_company', company);
        res.status(201).json(company);
    }
    catch (error) {
        console.error('Create company error:', error);
        res.status(500).json({ message: 'Error creating company', error });
    }
};
exports.createCompany = createCompany;
const getCompany = async (req, res) => {
    try {
        const id = String(req.params.id);
        const company = await prisma_1.default.company.findUnique({
            where: { id: parseInt(id) },
            include: { pfes: true }
        });
        if (!company)
            return res.status(404).json({ message: 'Company not found' });
        res.json(company);
    }
    catch (error) {
        res.status(500).json({ message: 'Error fetching company', error });
    }
};
exports.getCompany = getCompany;
const updateCompany = async (req, res) => {
    try {
        const id = String(req.params.id);
        const { name, sector, city, email, phone } = req.body;
        const company = await prisma_1.default.company.update({
            where: { id: parseInt(id) },
            data: { name, sector, city, email, phone }
        });
        res.json(company);
    }
    catch (error) {
        res.status(500).json({ message: 'Error updating company', error });
    }
};
exports.updateCompany = updateCompany;
const deleteCompany = async (req, res) => {
    try {
        const id = String(req.params.id);
        await prisma_1.default.company.delete({ where: { id: parseInt(id) } });
        res.json({ message: 'Company deleted' });
    }
    catch (error) {
        res.status(500).json({ message: 'Error deleting company', error });
    }
};
exports.deleteCompany = deleteCompany;
