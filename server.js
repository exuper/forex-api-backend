// server.js
require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcryptjs');

const app = express();
app.use(cors());
app.use(express.json());

// --- Database Connection ---
mongoose.connect(process.env.DATABASE_URL)
    .then(() => console.log('Connected to MongoDB Atlas'))
    .catch(err => console.error('Could not connect to MongoDB...', err));

// --- Mongoose Schemas ---
const signalSchema = new mongoose.Schema({ pair: String, type: String, entry: Number, takeProfit: Number, stopLoss: Number, createdAt: { type: Date, default: Date.now } });
const settingsSchema = new mongoose.Schema({
    fixedId: { type: String, default: 'main_settings', unique: true },
    appName: String, logoUrl: String, communityLink: String, brokerLink: String,
    primaryColor: String, secondaryColor: String, highlightColor: String,
    borderRadius: String, animatedBackground: String,
}, { timestamps: true });
const analysisSchema = new mongoose.schema({ title: String, content: String, imageUrl: String, createdAt: { type: Date, default: Date.now } });

const Signal = mongoose.model('Signal', signalSchema);
const AppSettings = mongoose.model('AppSettings', settingsSchema);
const Analysis = mongoose.model('Analysis', analysisSchema);

// --- API Routes ---
app.get('/', (req, res) => res.send('Aifx Signals API is fully operational!'));
app.get('/api/signals', async (req, res) => { try { const data = await Signal.find().sort({ createdAt: -1 }); res.json(data); } catch (e) { res.status(500).json({ message: e.message }); } });
app.post('/api/signals', async (req, res) => { try { const newData = new Signal(req.body); await newData.save(); res.status(201).json(newData); } catch (e) { res.status(400).json({ message: e.message }); } });
app.get('/api/settings', async (req, res) => { try { const data = await AppSettings.findOne({ fixedId: 'main_settings' }); res.json(data); } catch (e) { res.status(500).json({ message: e.message }); } });
app.post('/api/settings', async (req, res) => { try { const data = await AppSettings.findOneAndUpdate({ fixedId: 'main_settings' }, { $set: req.body }, { new: true, upsert: true }); res.json(data); } catch (e) { res.status(400).json({ message: e.message }); } });
app.get('/api/analysis', async (req, res) => { try { const data = await Analysis.find().sort({ createdAt: -1 }); res.json(data); } catch (e) { res.status(500).json({ message: e.message }); } });
app.post('/api/analysis', async (req, res) => { try { const newData = new Analysis(req.body); await newData.save(); res.status(201).json(newData); } catch (e) { res.status(400).json({ message: e.message }); } });

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));a// server.js
require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const bcrypt = require('bcryptjs');

const app = express();
app.use(cors());
app.use(express.json());

// --- Database Connection ---
mongoose.connect(process.env.DATABASE_URL)
    .then(() => console.log('Connected to MongoDB Atlas'))
    .catch(err => console.error('Could not connect to MongoDB...', err));

// --- Mongoose Schemas ---
const signalSchema = new mongoose.Schema({ pair: String, type: String, entry: Number, takeProfit: Number, stopLoss: Number, createdAt: { type: Date, default: Date.now } });
const settingsSchema = new mongoose.Schema({
    fixedId: { type: String, default: 'main_settings', unique: true },
    appName: String, logoUrl: String, communityLink: String, brokerLink: String,
    primaryColor: String, secondaryColor: String, highlightColor: String,
    borderRadius: String, animatedBackground: String,
}, { timestamps: true });
const analysisSchema = new mongoose.schema({ title: String, content: String, imageUrl: String, createdAt: { type: Date, default: Date.now } });

const Signal = mongoose.model('Signal', signalSchema);
const AppSettings = mongoose.model('AppSettings', settingsSchema);
const Analysis = mongoose.model('Analysis', analysisSchema);

// --- API Routes ---
app.get('/', (req, res) => res.send('Aifx Signals API is fully operational!'));
app.get('/api/signals', async (req, res) => { try { const data = await Signal.find().sort({ createdAt: -1 }); res.json(data); } catch (e) { res.status(500).json({ message: e.message }); } });
app.post('/api/signals', async (req, res) => { try { const newData = new Signal(req.body); await newData.save(); res.status(201).json(newData); } catch (e) { res.status(400).json({ message: e.message }); } });
app.get('/api/settings', async (req, res) => { try { const data = await AppSettings.findOne({ fixedId: 'main_settings' }); res.json(data); } catch (e) { res.status(500).json({ message: e.message }); } });
app.post('/api/settings', async (req, res) => { try { const data = await AppSettings.findOneAndUpdate({ fixedId: 'main_settings' }, { $set: req.body }, { new: true, upsert: true }); res.json(data); } catch (e) { res.status(400).json({ message: e.message }); } });
app.get('/api/analysis', async (req, res) => { try { const data = await Analysis.find().sort({ createdAt: -1 }); res.json(data); } catch (e) { res.status(500).json({ message: e.message }); } });
app.post('/api/analysis', async (req, res) => { try { const newData = new Analysis(req.body); await newData.save(); res.status(201).json(newData); } catch (e) { res.status(400).json({ message: e.message }); } });

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
