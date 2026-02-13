"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deactivateAlert = exports.createAlert = exports.listAlerts = void 0;
const prisma_1 = __importDefault(require("../utils/prisma"));
const listAlerts = async (req, res) => {
    try {
        const { role } = req.query;
        const alerts = await prisma_1.default.alert.findMany({
            where: {
                active: true,
                OR: [
                    { target: 'ALL' },
                    { target: role }
                ]
            },
            orderBy: { createdAt: 'desc' }
        });
        res.json(alerts);
    }
    catch (error) {
        res.status(500).json({ message: 'Error fetching alerts', error });
    }
};
exports.listAlerts = listAlerts;
const createAlert = async (req, res) => {
    try {
        const { type, title, content, target } = req.body;
        const alert = await prisma_1.default.alert.create({
            data: { type, title, content, target }
        });
        res.status(201).json(alert);
    }
    catch (error) {
        res.status(500).json({ message: 'Error creating alert', error });
    }
};
exports.createAlert = createAlert;
const deactivateAlert = async (req, res) => {
    try {
        const { id } = req.params;
        await prisma_1.default.alert.update({
            where: { id: parseInt(id) },
            data: { active: false }
        });
        res.json({ message: 'Alert deactivated' });
    }
    catch (error) {
        res.status(500).json({ message: 'Error deactivating alert', error });
    }
};
exports.deactivateAlert = deactivateAlert;
