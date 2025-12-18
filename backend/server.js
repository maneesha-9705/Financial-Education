
import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import jwt from 'jsonwebtoken';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 5001;
const DB_FILE = path.join(__dirname, 'db.json');
const SECRET_KEY = 'your-secret-key-here'; // In production, use environment variable

// Middleware
app.use(cors());
app.use(bodyParser.json());

// 1. Logger Middleware: Display requested URL and method
app.use((req, res, next) => {
    console.log(`\n--- Incoming Requests ---`);
    console.log(`Time: ${new Date().toISOString()}`);
    console.log(`Method: ${req.method}`);
    console.log(`URL: ${req.url}`);

    // Log Body if present and not empty
    if (req.body && Object.keys(req.body).length > 0) {
        console.log('Body:', JSON.stringify(req.body, null, 2));
    }

    // Hook to log response status
    res.on('finish', () => {
        console.log(`Response Status: ${res.statusCode}`);
        console.log(`--- End Requests ---\n`);
    });
    next();
});

// Helper to read DB
const readDb = () => {
    if (!fs.existsSync(DB_FILE)) return { users: [] };
    const data = fs.readFileSync(DB_FILE, 'utf8');
    return JSON.parse(data);
};

// Helper to write DB
const writeDb = (data) => {
    fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2));
};

// 2. Authentication Middleware
const authenticateToken = (req, res, next) => {
    console.log(`Auth Check: ${req.method} ${req.originalUrl}`);

    // Allow CORS preflight
    if (req.method === 'OPTIONS') {
        return next();
    }


    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

    if (!token) {
        console.log('Authentication Failed: No token provided for protected route');
        return res.status(401).json({ message: 'Access denied. No token provided.' });
    }

    try {
        const verified = jwt.verify(token, SECRET_KEY);
        req.user = verified;
        next();
    } catch (err) {
        console.log('Authentication Failed: Invalid token');
        // If token is invalid, frontend should probably clear it.
        res.status(403).json({ message: 'Invalid token' });
    }
};

// Apply Auth Middleware to all /api routes except login/register
// REMOVED GLOBAL AUTH MIDDLEWARE TO PREVENT ISSUES
// app.use('/api', authenticateToken);

// Page View Logging Endpoint
app.post('/api/log-page-view', (req, res) => {
    const { url } = req.body;
    console.log(`\n================================`);
    console.log(`>>> USER VISITED PAGE: ${url}`);
    console.log(`================================\n`);
    res.sendStatus(200);
});

// Routes

// Register (Public)
app.post('/api/register', (req, res) => {
    const { name, email, password, mobile } = req.body;
    console.log(`Registering user: ${email}`); // Debug log
    const db = readDb();

    // Check if user exists
    if (db.users.find(u => u.email === email)) {
        return res.status(400).json({ message: 'User already exists' });
    }

    const newUser = {
        id: Date.now().toString(),
        name,
        email,
        password, // Note: In a real app, hash this password!
        mobile,
        createdAt: new Date().toISOString()
    };

    db.users.push(newUser);
    writeDb(db);

    res.status(201).json({ message: 'User registered successfully', user: newUser });
});

// Login (Public)
app.post('/api/login', (req, res) => {
    const { email, password } = req.body;
    console.log(`Login attempt for: ${email}`); // Debug log
    const db = readDb();

    const user = db.users.find(u => u.email === email && u.password === password);

    if (!user) {
        return res.status(401).json({ message: 'Invalid email or password' });
    }

    // Generate Token
    const token = jwt.sign({ id: user.id, email: user.email }, SECRET_KEY, { expiresIn: '1h' });

    res.json({
        message: 'Login successful',
        token,
        user: {
            id: user.id,
            name: user.name,
            email: user.email,
            learningLevel: user.learningLevel
        }
    });
});

// Update User (Protected)
app.patch('/api/users/:id', authenticateToken, (req, res) => {
    const userId = req.params.id;

    // Ensure user is updating themselves
    if (req.user.id !== userId) {
        return res.status(403).json({ message: 'You can only update your own profile' });
    }

    const updates = req.body;
    const db = readDb();
    const userIndex = db.users.findIndex(u => u.id === userId);

    if (userIndex === -1) {
        return res.status(404).json({ message: 'User not found' });
    }

    const user = db.users[userIndex];
    const updatedUser = { ...user, ...updates };

    updatedUser.id = userId;

    db.users[userIndex] = updatedUser;
    writeDb(db);

    const { password, ...safeUser } = updatedUser;
    res.json(safeUser);
});

// Get Single User (Protected)
app.get('/api/users/:id', authenticateToken, (req, res) => {
    const userId = req.params.id;
    const db = readDb();
    const user = db.users.find(u => u.id === userId);

    if (!user) return res.status(404).json({ message: 'User not found' });

    if (req.user.id !== userId) {
        return res.status(403).json({ message: 'Access denied' });
    }

    const { password, ...safeUser } = user;
    res.json(safeUser);
});

// Get Users (Protected)
app.get('/api/users', authenticateToken, (req, res) => {
    const db = readDb();
    const safeUsers = db.users.map(({ password, ...u }) => u);
    res.json(safeUsers);
});

// Default route
app.get('/', (req, res) => {
    res.send('Financial Education API is running');
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
    console.log(`server is running at http://localhost:${PORT}`);
});
