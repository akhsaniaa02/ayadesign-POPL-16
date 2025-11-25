const express = require("express");
const app = express();
const mongoose = require("mongoose");
const cors = require("cors");
const path = require("path");
const authRouter = require('./routes/authRoute');
const orderRoute = require('./routes/orderRoute');
mongoose.set('strictQuery', true);

// Middlewares
app.use(cors({
    origin: [
        process.env.FRONTEND_URL || 'http://localhost:5173',
        'https://ayadesignstore.vercel.app',
        'https://ayadesign-muhammadbintang27s-projects.vercel.app', 
        'http://localhost:5173',
        'https://ayadesign-platform.vercel.app/'
    ],
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true,
    allowedHeaders: ['Content-Type', 'Authorization']
}));
app.use(express.json());

// Request logging middleware
app.use((req, res, next) => {
    console.log(`${req.method} ${req.url}`);
    next();
});

// Root route
app.get('/', (req, res) => {
    res.send('Server is up and running!');
});

// Routes
app.use('/auth', authRouter);
app.use('/uploads', express.static(path.join(__dirname, 'uploads'))); // Serve uploaded files
app.use('/api', orderRoute); // Added /api prefix for better organization

// 404 handler
app.use((req, res, next) => {
    console.log(`404 - Route not found: ${req.method} ${req.url}`);
    res.status(404).json({
        status: 'error',
        message: 'Route not found'
    });
});

// MongoDB Connection
mongoose
    .connect(process.env.MONGO_URI)
    .then(() => console.log("MongoDB connected"))
    .catch((err) => console.error('Failed to connect to MongoDB', err));

// Global error handler
app.use((err, req, res, next) => {
    console.error('Error:', err);
    err.status = err.status || 'error';
    err.statusCode = err.statusCode || 500;
    res.status(err.statusCode).json({
        status: err.status,
        message: err.message
    });
});

// Server
const PORT = process.env.PORT || 3000;

// Export for Vercel serverless
module.exports = app;

// Only start server if not in serverless environment
if (process.env.NODE_ENV !== 'production' || !process.env.VERCEL) {
    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
}
