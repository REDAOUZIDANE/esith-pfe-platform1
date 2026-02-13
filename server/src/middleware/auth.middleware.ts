import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'esith-campuslink-secret-key-2024';

export const authenticateToken = async (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ message: 'Unauthorized: No token provided' });
    }

    const token = authHeader.split('Bearer ')[1];

    try {
        const decoded = jwt.verify(token, JWT_SECRET) as any;
        (req as any).user = {
            userId: decoded.id,
            email: decoded.email,
            role: decoded.role
        };
        next();
    } catch (error) {
        console.error('Error verifying JWT token:', error);
        res.status(401).json({ message: 'Unauthorized: Invalid token' });
    }
};
