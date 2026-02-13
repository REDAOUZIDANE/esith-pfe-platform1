"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteAlumni = exports.updateAlumni = exports.getAlumni = exports.createAlumni = exports.listAlumni = void 0;
const prisma_1 = __importDefault(require("../utils/prisma"));
const listAlumni = async (req, res) => {
    try {
        const alumni = await prisma_1.default.alumni.findMany();
        res.json(alumni);
    }
    catch (error) {
        res.status(500).json({ message: 'Error fetching alumni', error });
    }
};
exports.listAlumni = listAlumni;
const createAlumni = async (req, res) => {
    try {
        const { name, graduationYear, major, currentCompany, email, linkedIn } = req.body;
        const alumni = await prisma_1.default.alumni.create({
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
    }
    catch (error) {
        console.error('Create Alumni Error:', error);
        res.status(500).json({ message: 'Error creating alumni', error });
    }
};
exports.createAlumni = createAlumni;
const getAlumni = async (req, res) => {
    try {
        const id = String(req.params.id);
        const alumni = await prisma_1.default.alumni.findUnique({
            where: { id: parseInt(id) }
        });
        if (!alumni)
            return res.status(404).json({ message: 'Alumni not found' });
        res.json(alumni);
    }
    catch (error) {
        res.status(500).json({ message: 'Error fetching alumni', error });
    }
};
exports.getAlumni = getAlumni;
const updateAlumni = async (req, res) => {
    try {
        const id = String(req.params.id);
        const { name, graduationYear, major, currentCompany, email, linkedIn } = req.body;
        const alumni = await prisma_1.default.alumni.update({
            where: { id: parseInt(id) },
            data: { name, graduationYear, major, currentCompany, email, linkedIn }
        });
        res.json(alumni);
    }
    catch (error) {
        res.status(500).json({ message: 'Error updating alumni', error });
    }
};
exports.updateAlumni = updateAlumni;
const deleteAlumni = async (req, res) => {
    try {
        const id = String(req.params.id);
        await prisma_1.default.alumni.delete({ where: { id: parseInt(id) } });
        res.json({ message: 'Alumni deleted' });
    }
    catch (error) {
        res.status(500).json({ message: 'Error deleting alumni', error });
    }
};
exports.deleteAlumni = deleteAlumni;
