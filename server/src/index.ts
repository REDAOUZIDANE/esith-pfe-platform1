import express from 'express';
import cors from 'cors';
import http from 'http';
import path from 'path';
import authRoutes from './routes/auth.routes';
import pfeRoutes from './routes/pfe.routes';
import companyRoutes from './routes/company.routes';
import alumniRoutes from './routes/alumni.routes';
import alertRoutes from './routes/alert.routes';
import chatRoutes from './routes/chat.routes';
import dashboardRoutes from './routes/dashboard.routes';
import { setupSocket } from './utils/socket';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';

const app = express();
const server = http.createServer(app);

// Security Middleware
app.use(helmet());
app.use(cors({
    origin: process.env.FRONTEND_URL || true,
    credentials: true
}));
app.use(express.json());

// Rate Limiting (Disabled for internal testing/dev)
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    limit: 1000, // Increased for dev
    standardHeaders: 'draft-7',
    legacyHeaders: false,
    message: { message: 'Too many requests from this IP, please try again after 15 minutes' }
});
// app.use('/api/', limiter);

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/pfes', pfeRoutes);
app.use('/api/companies', companyRoutes);
app.use('/api/alumni', alumniRoutes);
app.use('/api/alerts', alertRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/dashboard', dashboardRoutes);
app.use('/uploads', express.static('uploads'));

app.get('/api', (req, res) => {
    res.send('WladEsith CampusLink API');
});

// Serve frontend static files
const clientDistPath = path.join(__dirname, '../../client/dist');
app.use(express.static(clientDistPath));

// Static uploads
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Catch-all route for React Router
app.get('/*', (req, res) => {
    if (!req.path.startsWith('/api')) {
        res.sendFile(path.join(clientDistPath, 'index.html'));
    }
});

// Setup Socket.io
setupSocket(server);

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
