// Load environment variables from a .env file
require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// --- Database Connection ---
mongoose.connect(process.env.DATABASE_URL, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('Connected to MongoDB Atlas'))
    .catch(err => console.error('Could not connect to MongoDB...', err));

// --- Mongoose Schemas (Data Structures) ---
const signalSchema = new mongoose.Schema({
    pair: String, type: String, entry: Number,
    takeProfit: Number, stopLoss: Number,
    createdAt: { type: Date, default: Date.now }
});

const settingsSchema = new mongoose.Schema({
    fixedId: { type: String, default: 'main_settings', unique: true },
    appName: String, logoUrl: String, communityLink: String, brokerLink: String,
    primaryColor: String, secondaryColor: String, highlightColor: String,
    borderRadius: String, animatedBackground: String,
}, { timestamps: true });

// --- NEW: Schema for Analysis Posts ---
const analysisSchema = new mongoose.Schema({
    title: String,
    content: String,
    imageUrl: String,
    createdAt: { type: Date, default: Date.now }
});


const Signal = mongoose.model('Signal', signalSchema);
const AppSettings = mongoose.model('AppSettings', settingsSchema);
const Analysis = mongoose.model('Analysis', analysisSchema); // --- NEW: Model for Analysis


// --- API Routes ---
app.get('/', (req, res) => {
    res.send('Forex App API is running with full features!');
});

// --- Signal Routes ---
app.get('/api/signals', async (req, res) => { /* ... (code remains the same) ... */ });
app.post('/api/signals', async (req, res) => { /* ... (code remains the same) ... */ });

// --- App Settings Route ---
app.get('/api/settings', async (req, res) => { /* ... (code remains the same) ... */ });
app.post('/api/settings', async (req, res) => { /* ... (code remains the same) ... */ });


// --- NEW: API Routes for Analysis ---
app.get('/api/analysis', async (req, res) => {
    try {
        const posts = await Analysis.find().sort({ createdAt: -1 });
        res.json(posts);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching analysis posts' });
    }
});

app.post('/api/analysis', async (req, res) => {
    const newPost = new Analysis(req.body);
    try {
        const savedPost = await newPost.save();
        res.status(201).json(savedPost);
    } catch (error) {
        res.status(400).json({ message: 'Error saving analysis post' });
    }
});


app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
