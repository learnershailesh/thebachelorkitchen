require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const connectDB = require('./config/db');
const { notFound, errorHandler } = require('./middleware/errorMiddleware');

// Connect to Database
connectDB();

const app = express();

// Rate Limiting
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 100, // Limit each IP to 100 requests per window
    message: 'Too many requests from this IP, please try again after 15 minutes'
});

// Middleware
app.use(limiter);
app.use(helmet());

// Parse ALLOWED_ORIGINS from environment variable (comma-separated)
// If not set, defaults to localhost for local development
const allowedOrigins = process.env.ALLOWED_ORIGINS 
    ? process.env.ALLOWED_ORIGINS.split(',').map(origin => origin.trim())
    : ['http://localhost:3000', 'http://localhost:5173', 'http://localhost:3001'];

app.use(cors({
    origin: allowedOrigins,
    credentials: true
}));
app.use(express.json());

// Request logging (Minimal for production)
app.use((req, res, next) => {
    if (process.env.NODE_ENV !== 'production' || req.method !== 'POST') {
        console.log(`[${new Date().toISOString()}] ${req.method} ${req.url}`);
    }
    next();
});

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/subscription', require('./routes/subscription'));
app.use('/api/plans', require('./routes/plans'));
app.use('/api/admin', require('./routes/admin'));

app.get('/health', (req, res) => {
    res.status(200).json({ status: 'ok' });
});

app.get('/', (req, res) => {
    res.send('API is running...');
});

// Error Middleware
app.use(notFound);
app.use(errorHandler);

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
