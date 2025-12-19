import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import { fileURLToPath } from 'url';
import path from 'path';
import connectDB from './config/db.js';
import userRoutes from './routes/userRoutes.js';
import experienceRoutes from './routes/experienceRoutes.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


dotenv.config({ path: path.join(__dirname, '.env') });

// Connect to MongoDB
connectDB();

const app = express();
const PORT = process.env.PORT || 5001;

// Middleware
app.use(cors());
app.use(express.json()); // Replaces body-parser

// Logger Middleware
app.use((req, res, next) => {
    console.log(`\n--- Incoming Request ---`);
    console.log(`Time: ${new Date().toISOString()}`);
    console.log(`Method: ${req.method}`);
    console.log(`URL: ${req.url}`);
    next();
});

// Routes
app.use('/api', userRoutes);
app.use('/api/community', experienceRoutes);

// Page View Logging Endpoint (Kept from original)
app.post('/api/log-page-view', (req, res) => {
    const { url } = req.body;
    console.log(`\n================================`);
    console.log(`>>> USER VISITED PAGE: ${url}`);
    console.log(`================================\n`);
    res.sendStatus(200);
});

// Default Route
app.get('/', (req, res) => {
    res.send('Financial Education API is running...');
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    console.log(`http://localhost:${PORT}`);
});
