const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const xss = require('xss-clean');
const hpp = require('hpp');
const rateLimit = require('express-rate-limit');
const prisma = require('./prismaClient');

const app = express();


// Set security headers
app.use(helmet());

// Enable CORS
app.use(cors({
    origin: [process.env.FRONTEND_URL || 'http://localhost:5173', 'http://localhost:5174'],
    credentials: true,
}));

// Body parser
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Data sanitization against XSS
app.use(xss());

// Prevent HTTP param pollution
app.use(hpp());

// Rate Limiting
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 mins
    max: 150, // Limit each IP to 150 requests per windowMs
    message: 'Too many requests from this IP, please try again later.'
});
app.use('/api', limiter);

// Root Route
app.get('/', (req, res) => {
    res.send('SkillPath Backend API is running. Access endpoints via /api/...');
});

// Base Route
app.get('/api/health', async (req, res) => {
    try {
        await prisma.$queryRaw`SELECT 1`;
        res.status(200).json({
            status: 'success',
            message: 'API is running',
            database: 'Connected (PostgreSQL)'
        });
    } catch (error) {
        console.error('Health check database error:', error);
        res.status(500).json({
            status: 'error',
            message: 'API is running',
            database: 'Disconnected',
            error: error.message
        });
    }
});


// To be imported: 
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/dashboard', require('./routes/dashboardRoutes'));

app.use('/api/v1/jobs', require('./routes/jobRoutes'));
app.use('/api/v1/habits', require('./routes/habitRoutes'));
app.use('/api/v1/communication', require('./routes/communicationRoutes'));
app.use('/api/v1/test-system', require('./routes/testSystemRoutes'));
app.use('/api/v1/resumes', require('./routes/resumeRoutes'));


app.use('/api/v1/bookmarks', require('./routes/bookmarkRoutes'));
app.use('/api/v1/events', require('./routes/eventRoutes'));
app.use('/api/v1/certifications', require('./routes/certificationRoutes'));
app.use('/api/v1/labs', require('./routes/labRoutes'));
app.use('/api/v1/notifications', require('./routes/notificationRoutes'));
app.use('/api/v1/community', require('./routes/communityRoutes'));

// Global Error Handler
app.use((err, req, res, next) => {
    console.error(err.stack);
    const statusCode = err.statusCode || 500;
    res.status(statusCode).json({
        success: false,
        error: err.message || 'Server Error',
        stack: process.env.NODE_ENV === 'production' ? null : err.stack
    });
});

module.exports = app;

