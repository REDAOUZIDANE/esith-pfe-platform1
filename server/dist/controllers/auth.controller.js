"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateUserRole = exports.deleteUser = exports.listUsers = exports.resetPassword = exports.forgotPassword = exports.changePassword = exports.updateProfile = exports.getMe = exports.login = exports.register = void 0;
const prisma_1 = __importDefault(require("../utils/prisma"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const crypto_1 = __importDefault(require("crypto"));
const JWT_SECRET = process.env.JWT_SECRET || 'esith-campuslink-secret-key-2024';
const register = async (req, res) => {
    try {
        const { email, password, name, major } = req.body;
        if (!email.toLowerCase().endsWith('@esith.net')) {
            return res.status(400).json({ message: 'Only @esith.net email addresses are allowed.' });
        }
        const existingUser = await prisma_1.default.user.findUnique({ where: { email } });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }
        const hashedPassword = await bcryptjs_1.default.hash(password, 10);
        const user = await prisma_1.default.user.create({
            data: {
                email,
                password: hashedPassword,
                name,
                major,
                role: email.startsWith('admin@') ? 'ADMIN' : 'STUDENT'
            }
        });
        const token = jsonwebtoken_1.default.sign({ id: user.id, email: user.email, role: user.role }, JWT_SECRET, { expiresIn: '24h' });
        res.status(201).json({
            message: 'User registered successfully',
            token,
            user: { id: user.id, email: user.email, name: user.name, role: user.role, major: user.major, about: user.about, skills: user.skills }
        });
    }
    catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};
exports.register = register;
const login = async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await prisma_1.default.user.findUnique({ where: { email } });
        if (!user) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }
        const isPasswordValid = await bcryptjs_1.default.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }
        const token = jsonwebtoken_1.default.sign({ id: user.id, email: user.email, role: user.role }, JWT_SECRET, { expiresIn: '24h' });
        res.json({
            token,
            user: { id: user.id, email: user.email, name: user.name, role: user.role, major: user.major, about: user.about, skills: user.skills, profileImage: user.profileImage }
        });
    }
    catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};
exports.login = login;
const getMe = async (req, res) => {
    try {
        const userId = req.user?.userId;
        if (!userId)
            return res.status(401).json({ message: 'Unauthorized' });
        const user = await prisma_1.default.user.findUnique({ where: { id: userId } });
        if (!user)
            return res.status(404).json({ message: 'User not found' });
        res.json({ id: user.id, email: user.email, name: user.name, role: user.role, major: user.major, about: user.about, skills: user.skills, profileImage: user.profileImage });
    }
    catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};
exports.getMe = getMe;
const updateProfile = async (req, res) => {
    try {
        const userId = req.user?.userId;
        const { name, major, about, skills } = req.body;
        const profileImage = req.file ? `/uploads/profiles/${req.file.filename}` : undefined;
        const updateData = { name, major, about, skills };
        if (profileImage)
            updateData.profileImage = profileImage;
        const user = await prisma_1.default.user.update({
            where: { id: userId },
            data: updateData
        });
        res.json({
            message: 'Profile updated',
            user: {
                id: user.id,
                email: user.email,
                name: user.name,
                role: user.role,
                major: user.major,
                profileImage: user.profileImage,
                about: user.about,
                skills: user.skills
            }
        });
    }
    catch (error) {
        console.error('Update profile error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};
exports.updateProfile = updateProfile;
const changePassword = async (req, res) => {
    try {
        const userId = req.user?.userId;
        const { currentPassword, newPassword } = req.body;
        const user = await prisma_1.default.user.findUnique({ where: { id: userId } });
        if (!user)
            return res.status(404).json({ message: 'User not found' });
        const isMatch = await bcryptjs_1.default.compare(currentPassword, user.password);
        if (!isMatch)
            return res.status(400).json({ message: 'Current password is incorrect' });
        const hashedPassword = await bcryptjs_1.default.hash(newPassword, 10);
        await prisma_1.default.user.update({
            where: { id: userId },
            data: { password: hashedPassword }
        });
        res.json({ message: 'Password changed successfully' });
    }
    catch (error) {
        console.error('Change password error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};
exports.changePassword = changePassword;
const forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;
        const user = await prisma_1.default.user.findUnique({ where: { email } });
        if (!user) {
            // To prevent email enumeration, we return 200 even if user doesn't exist
            return res.json({ message: 'If an account with that email exists, a password reset link has been sent.' });
        }
        const token = crypto_1.default.randomBytes(32).toString('hex');
        const expires = new Date(Date.now() + 3600000); // 1 hour from now
        await prisma_1.default.user.update({
            where: { id: user.id },
            data: {
                resetPasswordToken: token,
                resetPasswordExpires: expires
            }
        });
        // In a real app, send an email. For now, log to console.
        const resetUrl = `${process.env.FRONTEND_URL || 'http://localhost:5173'}/reset-password/${token}`;
        console.log('------------------------------------------');
        console.log('PASSWORD RESET REQUEST for:', email);
        console.log('RESET LINK:', resetUrl);
        console.log('------------------------------------------');
        res.json({ message: 'If an account with that email exists, a password reset link has been sent.' });
    }
    catch (error) {
        console.error('Forgot password error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};
exports.forgotPassword = forgotPassword;
const resetPassword = async (req, res) => {
    try {
        const { token, password } = req.body;
        const user = await prisma_1.default.user.findFirst({
            where: {
                resetPasswordToken: token,
                resetPasswordExpires: { gt: new Date() }
            }
        });
        if (!user) {
            return res.status(400).json({ message: 'Invalid or expired password reset token' });
        }
        const hashedPassword = await bcryptjs_1.default.hash(password, 10);
        await prisma_1.default.user.update({
            where: { id: user.id },
            data: {
                password: hashedPassword,
                resetPasswordToken: null,
                resetPasswordExpires: null
            }
        });
        res.json({ message: 'Password has been reset successfully. You can now log in with your new password.' });
    }
    catch (error) {
        console.error('Reset password error:', error);
        res.status(500).json({ message: 'Server error' });
    }
};
exports.resetPassword = resetPassword;
const listUsers = async (req, res) => {
    try {
        const users = await prisma_1.default.user.findMany({
            select: {
                id: true,
                email: true,
                name: true,
                role: true,
                major: true,
                profileImage: true,
                createdAt: true
            }
        });
        res.json(users);
    }
    catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};
exports.listUsers = listUsers;
const deleteUser = async (req, res) => {
    try {
        const id = String(req.params.id);
        await prisma_1.default.user.delete({ where: { id: parseInt(id) } });
        res.json({ message: 'User deleted successfully' });
    }
    catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};
exports.deleteUser = deleteUser;
const updateUserRole = async (req, res) => {
    try {
        const id = String(req.params.id);
        const { role } = req.body;
        const user = await prisma_1.default.user.update({
            where: { id: parseInt(id) },
            data: { role }
        });
        res.json({ message: 'User role updated', role: user.role });
    }
    catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
};
exports.updateUserRole = updateUserRole;
