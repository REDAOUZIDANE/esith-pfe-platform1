import { Server } from 'socket.io';
import { Server as HttpServer } from 'http';
import prisma from './prisma';

let ioInstance: Server;

export const setupSocket = (server: HttpServer) => {
    const io = new Server(server, {
        cors: {
            origin: "http://localhost:5173",
            methods: ["GET", "POST"]
        }
    });

    ioInstance = io;

    const onlineUsers = new Map<number, string>(); // userId -> socketId

    io.on('connection', (socket) => {
        console.log('User connected:', socket.id);

        socket.on('authenticate', (userId: number) => {
            if (userId) {
                onlineUsers.set(userId, socket.id);
                io.emit('online_users', Array.from(onlineUsers.keys()));
            }
        });

        socket.on('join_global', () => {
            socket.join('room_global');
        });

        socket.on('join_major', (major: string) => {
            const roomName = `room_major_${major.replace(/\s+/g, '_').toLowerCase()}`;
            socket.join(roomName);
        });

        socket.on('send_message', async (data) => {
            try {
                const newMessage = await prisma.message.create({
                    data: {
                        content: data.content,
                        type: data.type || 'TEXT',
                        fileUrl: data.fileUrl,
                        duration: data.duration,
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
            } catch (error) {
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

export const getIO = () => ioInstance;
