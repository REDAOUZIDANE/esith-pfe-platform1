"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getIO = exports.setupSocket = void 0;
const socket_io_1 = require("socket.io");
const prisma_1 = __importDefault(require("./prisma"));
let ioInstance;
const setupSocket = (server) => {
    const io = new socket_io_1.Server(server, {
        cors: {
            origin: "http://localhost:5173",
            methods: ["GET", "POST"]
        }
    });
    ioInstance = io;
    const onlineUsers = new Map(); // userId -> socketId
    io.on('connection', (socket) => {
        console.log('User connected:', socket.id);
        socket.on('authenticate', (userId) => {
            if (userId) {
                onlineUsers.set(userId, socket.id);
                io.emit('online_users', Array.from(onlineUsers.keys()));
            }
        });
        socket.on('join_global', () => {
            socket.join('room_global');
        });
        socket.on('join_major', (major) => {
            const roomName = `room_major_${major.replace(/\s+/g, '_').toLowerCase()}`;
            socket.join(roomName);
        });
        socket.on('send_message', async (data) => {
            try {
                const newMessage = await prisma_1.default.message.create({
                    data: {
                        content: data.content,
                        room: data.room,
                        senderId: data.senderId
                    },
                    include: {
                        sender: {
                            select: { name: true, major: true, role: true }
                        }
                    }
                });
                io.to(data.room).emit('receive_message', newMessage);
            }
            catch (error) {
                console.error('Error saving message:', error);
            }
        });
        socket.on('disconnect', () => {
            for (const [userId, socketId] of onlineUsers.entries()) {
                if (socketId === socket.id) {
                    onlineUsers.delete(userId);
                    break;
                }
            }
            io.emit('online_users', Array.from(onlineUsers.keys()));
            console.log('User disconnected');
        });
    });
    return io;
};
exports.setupSocket = setupSocket;
const getIO = () => ioInstance;
exports.getIO = getIO;
