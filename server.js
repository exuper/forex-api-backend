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
    // Using a fixed ID ensures we only ever have one settings document in our database
    fixedId: { type: String, default: 'main_settings', unique: true },
    appName: String,
    logoUrl: String,
    communityLink: String,
    brokerLink: String,
    primaryColor: String,
    secondaryColor: String,
    highlightColor: String,
    borderRadius: String,
    animatedBackground: String,
}, { timestamps: true });

const Signal = mongoose.model('Signal', signalSchema);
const AppSettings = mongoose.model('AppSettings', settingsSchema);


// --- API Routes ---
app.get('/', (req, res) => {
    res.send('Forex App API is running with full features!');
});

// GET: Retrieve all signals
app.get('/api/signals', async (req, res) => {
    try {
        const signals = await Signal.find().sort({ createdAt: -1 });
        res.json(signals);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching signals' });
    }
});

// POST: Add a new signal
app.post('/api/signals', async (req, res) => {
    const newSignal = new Signal(req.body);
    try {
        const savedSignal = await newSignal.save();
        res.status(201).json(savedSignal);
    } catch (error) {
        res.status(400).json({ message: 'Error saving signal' });
    }
});

// --- NEW: API Routes for App Settings & Theme ---

// GET: Retrieve the current settings for the mobile app
app.get('/api/settings', async (req, res) => {
    try {
        const settings = await AppSettings.findOne({ fixedId: 'main_settings' });
        if (!settings) {
            // If no settings exist yet, send some default values
            return res.json({ appName: 'Aifx Signals', primaryColor: '#141E30' });
        }
        res.json(settings);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching settings' });
    }
});

// POST: Save or Update ALL settings from the admin panel
app.post('/api/settings', async (req, res) => {
    const settingsData = req.body;
    try {
        // Find the existing settings document and update it, or create it if it doesn't exist (upsert)
        const updatedSettings = await AppSettings.findOneAndUpdate(
            { fixedId: 'main_settings' }, // find document with this ID
            { $set: settingsData },      // update it with the new data
            { new: true, upsert: true, setDefaultsOnInsert: true } // options
        );
        res.status(200).json(updatedSettings);
    } catch (error) {
        res.status(400).json({ message: 'Error saving settings' });
    }
});


app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
