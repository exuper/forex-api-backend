// Load environment variables from a .env file
require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors()); // Allow requests from other origins (your frontend)
app.use(express.json()); // Allow the server to understand JSON data

// --- Database Connection ---
// The connection string should be in a separate .env file
mongoose.connect(process.env.DATABASE_URL, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('Connected to MongoDB Atlas'))
    .catch(err => console.error('Could not connect to MongoDB...', err));

// --- Mongoose Schema (The structure of your data) ---
const signalSchema = new mongoose.Schema({
    pair: String,
    type: String, // 'BUY' or 'SELL'
    entry: Number,
    takeProfit: Number,
    stopLoss: Number,
    createdAt: { type: Date, default: Date.now }
});

const Signal = mongoose.model('Signal', signalSchema);

// --- API Routes ---
app.get('/', (req, res) => {
    res.send('Forex App API is running!');
});

// GET: Retrieve all signals for the mobile app
app.get('/api/signals', async (req, res) => {
    try {
        const signals = await Signal.find().sort({ createdAt: -1 }); // Get newest first
        res.json(signals);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching signals' });
    }
});

// POST: Add a new signal from the admin panel
app.post('/api/signals', async (req, res) => {
    const { pair, type, entry, takeProfit, stopLoss } = req.body;

    const newSignal = new Signal({
        pair,
        type,
        entry,
        takeProfit,
        stopLoss
    });

    try {
        const savedSignal = await newSignal.save();
        res.status(201).json(savedSignal);
    } catch (error) {
        res.status(400).json({ message: 'Error saving signal' });
    }
});

// This can be expanded to include routes for themes, users, etc.

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});