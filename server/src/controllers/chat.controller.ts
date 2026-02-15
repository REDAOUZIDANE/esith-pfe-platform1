import { Request, Response } from 'express';
import prisma from '../utils/prisma';

export const listRooms = async (req: Request, res: Response) => {
    try {
        const rooms = await (prisma as any).chatRoom.findMany({
            orderBy: { createdAt: 'asc' }
        });
        res.json(rooms);
    } catch (error) {
        res.status(500).json({ message: 'Server error fetching rooms' });
    }
};

export const createRoom = async (req: Request, res: Response) => {
    try {
        const { name, icon, type } = req.body;
        if (!name) return res.status(400).json({ message: 'Room name is required' });

        const room = await (prisma as any).chatRoom.create({
            data: {
                name,
                icon: icon || name.substring(0, 2).toUpperCase(),
                type: type || 'GROUP'
            }
        });
        res.status(201).json(room);
    } catch (error) {
        res.status(500).json({ message: 'Server error creating room' });
    }
};

export const deleteRoom = async (req: Request, res: Response) => {
    try {
        const id = String(req.params.id);

        // Delete messages in this room first (using the room string)
        await prisma.message.deleteMany({
            where: { room: id } as any
        });

        await (prisma as any).chatRoom.delete({
            where: { id }
        });

        res.json({ message: 'Room and its messages deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server error deleting room' });
    }
};
