"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const http_1 = __importDefault(require("http"));
const auth_routes_1 = __importDefault(require("./routes/auth.routes"));
const pfe_routes_1 = __importDefault(require("./routes/pfe.routes"));
const company_routes_1 = __importDefault(require("./routes/company.routes"));
const alumni_routes_1 = __importDefault(require("./routes/alumni.routes"));
const alert_routes_1 = __importDefault(require("./routes/alert.routes"));
const socket_1 = require("./utils/socket");
const helmet_1 = __importDefault(require("helmet"));
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
const app = (0, express_1.default)();
const server = http_1.default.createServer(app);
// Security Middleware
app.use((0, helmet_1.default)());
app.use((0, cors_1.default)({
    origin: process.env.FRONTEND_URL || true,
    credentials: true
}));
app.use(express_1.default.json());
// Rate Limiting (Disabled for internal testing/dev)
const limiter = (0, express_rate_limit_1.default)({
    windowMs: 15 * 60 * 1000, // 15 minutes
    limit: 1000, // Increased for dev
    standardHeaders: 'draft-7',
    legacyHeaders: false,
    message: { message: 'Too many requests from this IP, please try again after 15 minutes' }
});
// app.use('/api/', limiter);
// Routes
app.use('/api/auth', auth_routes_1.default);
app.use('/api/pfes', pfe_routes_1.default);
app.use('/api/companies', company_routes_1.default);
app.use('/api/alumni', alumni_routes_1.default);
app.use('/api/alerts', alert_routes_1.default);
app.use('/uploads', express_1.default.static('uploads'));
app.get('/', (req, res) => {
    res.send('WladEsith CampusLink API');
});
// Setup Socket.io
(0, socket_1.setupSocket)(server);
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
