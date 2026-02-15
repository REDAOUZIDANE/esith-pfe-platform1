import multer from 'multer';
import path from 'path';
import fs from 'fs';

// Ensure base uploads directory exists
const baseUploadDir = path.join(__dirname, '../../uploads');
if (!fs.existsSync(baseUploadDir)) {
    fs.mkdirSync(baseUploadDir, { recursive: true });
}

// Subdirectories
const dirs = {
    documents: path.join(baseUploadDir, 'documents'),
    profiles: path.join(baseUploadDir, 'profiles'),
    chat: path.join(baseUploadDir, 'chat')
};

Object.values(dirs).forEach(dir => {
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
});

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        let dest = dirs.documents;
        if (file.fieldname === 'profileImage') dest = dirs.profiles;
        else if (file.fieldname === 'chatAttachment') dest = dirs.chat;
        cb(null, dest);
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
    }
});

const fileFilter = (req: any, file: Express.Multer.File, cb: multer.FileFilterCallback) => {
    const isProfile = file.fieldname === 'profileImage';
    const isChat = file.fieldname === 'chatAttachment';

    if (isProfile) {
        if (file.mimetype.startsWith('image/')) return cb(null, true);
        return cb(new Error('Only images are allowed for profiles!'));
    }

    if (isChat) {
        // Allow images, audio, video
        if (file.mimetype.startsWith('image/') ||
            file.mimetype.startsWith('audio/') ||
            file.mimetype.startsWith('video/')) {
            return cb(null, true);
        }
        return cb(new Error('File type not allowed for chat!'));
    }

    // Default: Documents
    const allowedTypes = /pdf|ppt|pptx|doc|docx/;
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);

    if (extname && mimetype) {
        return cb(null, true);
    } else {
        cb(new Error('Error: File type not allowed for documents!'));
    }
};

export const upload = multer({
    storage: storage,
    limits: { fileSize: 50 * 1024 * 1024 }, // 50MB limit to support video
    fileFilter: fileFilter
});
