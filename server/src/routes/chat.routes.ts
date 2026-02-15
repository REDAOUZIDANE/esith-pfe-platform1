import { Router, Request, Response } from 'express';
import { authenticateToken, authorizeAdmin } from '../middleware/auth.middleware';
import { upload } from '../middleware/upload.middleware';
import { createRoom, deleteRoom, listRooms } from '../controllers/chat.controller';

const router = Router();

router.get('/rooms', authenticateToken, listRooms);
router.post('/rooms', authenticateToken, authorizeAdmin, createRoom);
router.delete('/rooms/:id', authenticateToken, authorizeAdmin, deleteRoom);

router.post('/upload', authenticateToken, upload.single('chatAttachment'), (req: Request, res: Response) => {
    try {
        if (!req.file) return res.status(400).json({ message: 'No file uploaded' });

        const fileUrl = `/uploads/chat/${req.file.filename}`;
        res.json({
            fileUrl,
            type: req.file.mimetype.startsWith('audio/') ? 'AUDIO' :
                req.file.mimetype.startsWith('video/') ? 'VIDEO' :
                    req.file.mimetype.startsWith('image/') ? 'IMAGE' : 'FILE'
        });
    } catch (error) {
        res.status(500).json({ message: 'Upload failed' });
    }
});

export default router;
