"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deletePFE = exports.updatePFE = exports.getPFE = exports.createPFE = exports.listPFEs = void 0;
const prisma_1 = __importDefault(require("../utils/prisma"));
const socket_1 = require("../utils/socket");
const listPFEs = async (req, res) => {
    try {
        const pfes = await prisma_1.default.pFE.findMany({
            include: { company: true }
        });
        res.json(pfes);
    }
    catch (error) {
        res.status(500).json({ message: 'Error fetching PFEs', error });
    }
};
exports.listPFEs = listPFEs;
const createPFE = async (req, res) => {
    try {
        const { title, description, academicYear, major, studentNames, students, companyId } = req.body;
        const files = req.files;
        const reportUrl = files && files['report'] ? `/uploads/${files['report'][0].filename}` : null;
        const presentationUrl = files && files['presentation'] ? `/uploads/${files['presentation'][0].filename}` : null;
        const pfe = await prisma_1.default.pFE.create({
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
        const io = (0, socket_1.getIO)();
        if (io)
            io.emit('new_pfe', pfe);
        res.status(201).json(pfe);
    }
    catch (error) {
        console.error('Create PFE error:', error);
        res.status(500).json({ message: 'Error creating PFE', error });
    }
};
exports.createPFE = createPFE;
const getPFE = async (req, res) => {
    try {
        const id = String(req.params.id);
        const pfe = await prisma_1.default.pFE.findUnique({
            where: { id: parseInt(id) },
            include: { company: true }
        });
        if (!pfe)
            return res.status(404).json({ message: 'PFE not found' });
        res.json(pfe);
    }
    catch (error) {
        res.status(500).json({ message: 'Error fetching PFE', error });
    }
};
exports.getPFE = getPFE;
const updatePFE = async (req, res) => {
    try {
        const id = String(req.params.id);
        const { title, description, academicYear, major, studentNames, companyId } = req.body;
        const files = req.files;
        const updateData = { title, description, academicYear, major, studentNames };
        if (companyId)
            updateData.companyId = parseInt(companyId);
        if (files) {
            if (files['report'])
                updateData.reportUrl = `/uploads/${files['report'][0].filename}`;
            if (files['presentation'])
                updateData.presentationUrl = `/uploads/${files['presentation'][0].filename}`;
        }
        const pfe = await prisma_1.default.pFE.update({
            where: { id: parseInt(id) },
            data: updateData
        });
        res.json(pfe);
    }
    catch (error) {
        res.status(500).json({ message: 'Error updating PFE', error });
    }
};
exports.updatePFE = updatePFE;
const deletePFE = async (req, res) => {
    try {
        const id = String(req.params.id);
        await prisma_1.default.pFE.delete({ where: { id: parseInt(id) } });
        res.json({ message: 'PFE deleted' });
    }
    catch (error) {
        res.status(500).json({ message: 'Error deleting PFE', error });
    }
};
exports.deletePFE = deletePFE;
