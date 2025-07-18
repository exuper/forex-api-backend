// server.js
require('dotenv').config();
const express = require('express');
const mongoose =require('mongoose');
const cors = require('cors');
const bcrypt = require('bcryptjs'); // For password hashing

const app = express();
app.use(cors());
app.use(express.json());

// --- Database Connection ---
mongoose.connect(process.env.DATABASE_URL, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('Connected to MongoDB Atlas'))
    .catch(err => console.error('Could not connect to MongoDB...', err));

// --- Mongoose Schemas ---
const signalSchema = new mongoose.Schema({ /* ... (no changes) ... */ });
const settingsSchema = new mongoose.Schema({ /* ... (no changes) ... */ });
const analysisSchema = new mongoose.Schema({ /* ... (no changes) ... */ });

// --- NEW: Schema for Sub-Admins (includes password) ---
const subAdminSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
});
// Hash password before saving
subAdminSchema.pre('save', async function(next) {
    if (!this.isModified('password')) return next();
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
});

const Signal = mongoose.model('Signal', signalSchema);
const AppSettings = mongoose.model('AppSettings', settingsSchema);
const Analysis = mongoose.model('Analysis', analysisSchema);
const SubAdmin = mongoose.model('SubAdmin', subAdminSchema);

// --- API Routes ---
app.get('/', (req, res) => res.send('Aifx Signals API is fully operational!'));

// Signal, Settings, and Analysis routes remain the same
app.get('/api/signals', async (req, res) => { /* ... */ });
app.post('/api/signals', async (req, res) => { /* ... */ });
app.get('/api/settings', async (req, res) => { /* ... */ });
app.post('/api/settings', async (req, res) => { /* ... */ });
app.get('/api/analysis', async (req, res) => { /* ... */ });
app.post('/api/analysis', async (req, res) => { /* ... */ });

// --- NEW: API Routes for Sub-Admins ---
app.get('/api/subadmins', async (req, res) => {
    try {
        const admins = await SubAdmin.find().select('-password'); // Don't send password back
        res.json(admins);
    } catch (error) { res.status(500).json({ message: 'Error fetching sub-admins' }); }
});

app.post('/api/subadmins', async (req, res) => {
    try {
        const { name, email, password } = req.body;
        // Basic validation
        if (!name || !email || !password) {
            return res.status(400).json({ message: 'All fields are required' });
        }
        const newAdmin = new SubAdmin({ name, email, password });
        await newAdmin.save();
        res.status(201).json({ message: 'Sub-admin created successfully' });
    } catch (error) { res.status(400).json({ message: 'Error creating sub-admin', error }); }
});

app.delete('/api/subadmins/:id', async (req, res) => {
    try {
        await SubAdmin.findByIdAndDelete(req.params.id);
        res.status(200).json({ message: 'Sub-admin deleted' });
    } catch (error) { res.status(500).json({ message: 'Error deleting sub-admin' }); }
});

// --- NEW: API Route for Changing Main Admin Password (Simplified) ---
app.post('/api/admin/change-password', async (req, res) => {
    // NOTE: In a real app, this would be a secure, authenticated route.
    // This is a simplified example.
    const { currentPassword, newPassword } = req.body;
    if (currentPassword === 'Victor.50') { // Simplified check
        console.log('Password updated (simulation). In a real app, you would hash and save the newPassword.');
        res.status(200).json({ message: 'Password updated successfully!' });
    } else {
        res.status(400).json({ message: 'Incorrect current password.' });
    }
});


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
