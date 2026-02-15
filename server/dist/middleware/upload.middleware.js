"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.upload = void 0;
const multer_1 = __importDefault(require("multer"));
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
// Ensure base uploads directory exists
const baseUploadDir = path_1.default.join(__dirname, '../../uploads');
if (!fs_1.default.existsSync(baseUploadDir)) {
    fs_1.default.mkdirSync(baseUploadDir, { recursive: true });
}
// Subdirectories
const dirs = {
    documents: path_1.default.join(baseUploadDir, 'documents'),
    profiles: path_1.default.join(baseUploadDir, 'profiles'),
    chat: path_1.default.join(baseUploadDir, 'chat')
};
Object.values(dirs).forEach(dir => {
    if (!fs_1.default.existsSync(dir))
        fs_1.default.mkdirSync(dir, { recursive: true });
});
const storage = multer_1.default.diskStorage({
    destination: (req, file, cb) => {
        let dest = dirs.documents;
        if (file.fieldname === 'profileImage')
            dest = dirs.profiles;
        else if (file.fieldname === 'chatAttachment')
            dest = dirs.chat;
        cb(null, dest);
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, file.fieldname + '-' + uniqueSuffix + path_1.default.extname(file.originalname));
    }
});
const fileFilter = (req, file, cb) => {
    const isProfile = file.fieldname === 'profileImage';
    const isChat = file.fieldname === 'chatAttachment';
    if (isProfile) {
        if (file.mimetype.startsWith('image/'))
            return cb(null, true);
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
    const extname = allowedTypes.test(path_1.default.extname(file.originalname).toLowerCase());
    const mimetype = allowedTypes.test(file.mimetype);
    if (extname && mimetype) {
        return cb(null, true);
    }
    else {
        cb(new Error('Error: File type not allowed for documents!'));
    }
};
exports.upload = (0, multer_1.default)({
    storage: storage,
    limits: { fileSize: 50 * 1024 * 1024 }, // 50MB limit to support video
    fileFilter: fileFilter
});
