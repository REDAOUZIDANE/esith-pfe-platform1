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
app.use(helmet({
    contentSecurityPolicy: false, // Disable CSP for easier deployment, react-router usage
}));
app.use(cors({
    origin: true,
    credentials: true
}));
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/pfes', pfeRoutes);
app.use('/api/companies', companyRoutes);
app.use('/api/alumni', alumniRoutes);
app.use('/api/alerts', alertRoutes);
app.use('/api/chat', chatRoutes);
app.use('/api/dashboard', dashboardRoutes);

// Static uploads
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

app.get('/api', (req, res) => {
    res.send('WladEsith CampusLink API');
});

// Serve frontend static files
const clientDistPath = path.join(__dirname, '../../client/dist');
app.use(express.static(clientDistPath));

// Final catch-all for React Router or missing API routes
app.use((req, res) => {
    if (!req.path.startsWith('/api')) {
        res.sendFile(path.join(clientDistPath, 'index.html'));
    } else {
        res.status(404).send('API endpoint not found');
    }
});

// Setup Socket.io
setupSocket(server);

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
