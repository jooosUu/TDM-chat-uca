const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const path = require('path');
const fs = require('fs');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

const PORT = process.env.PORT || 3000;
const DB_PATH = path.join(__dirname, 'data/db.json');

// --- Helpers ---
function readDB() {
    try {
        return JSON.parse(fs.readFileSync(DB_PATH, 'utf8'));
    } catch {
        return { messages: [], profiles: {} };
    }
}

function writeDB(data) {
    fs.writeFileSync(DB_PATH, JSON.stringify(data, null, 4), 'utf8');
}

// --- Middleware ---
app.use(express.json({ limit: '5mb' }));
app.use(express.static(path.join(__dirname, '../public')));

// --- API Routes ---

// GET /api/data - Returns all data (profiles + messages)
app.get('/api/data', (req, res) => {
    const db = readDB();
    res.json(db);
});

// GET /api/profile/:role - Returns a specific profile
app.get('/api/profile/:role', (req, res) => {
    const db = readDB();
    const profile = db.profiles?.[req.params.role];
    if (profile) {
        res.json(profile);
    } else {
        res.status(404).json({ error: 'Profile not found' });
    }
});

// POST /api/profile/:role - Updates a profile
app.post('/api/profile/:role', (req, res) => {
    const db = readDB();
    const role = req.params.role;
    if (!db.profiles) db.profiles = {};
    db.profiles[role] = { ...db.profiles[role], ...req.body };
    writeDB(db);
    // Broadcast profile update to all connected clients
    io.emit('profile-updated', { role, profile: db.profiles[role] });
    res.json({ success: true, profile: db.profiles[role] });
});

// GET /api/messages - Returns all messages
app.get('/api/messages', (req, res) => {
    const db = readDB();
    res.json(db.messages || []);
});

// POST /api/messages - Saves a new message
app.post('/api/messages', (req, res) => {
    const db = readDB();
    if (!db.messages) db.messages = [];
    const msg = {
        id: Date.now().toString(),
        sender: req.body.sender,
        role: req.body.role,
        text: req.body.text,
        timestamp: req.body.timestamp || new Date().toISOString()
    };
    db.messages.push(msg);
    writeDB(db);
    res.json({ success: true, message: msg });
});

// --- Socket.io ---
io.on('connection', (socket) => {
    console.log('User connected:', socket.id);

    // Client sends a chat message
    socket.on('chat-message', (data) => {
        // data: { sender, role, text, timestamp }
        const db = readDB();
        if (!db.messages) db.messages = [];
        const msg = {
            id: Date.now().toString(),
            sender: data.sender,
            role: data.role,
            text: data.text,
            timestamp: data.timestamp || new Date().toISOString()
        };
        db.messages.push(msg);
        writeDB(db);

        // Broadcast to ALL clients (including sender for confirmation)
        io.emit('chat-message', msg);
    });

    // Profile change broadcast
    socket.on('profile-change', (data) => {
        // data: { role, field, value }
        const db = readDB();
        if (!db.profiles) db.profiles = {};
        if (!db.profiles[data.role]) db.profiles[data.role] = {};
        db.profiles[data.role][data.field] = data.value;
        writeDB(db);
        io.emit('profile-updated', { role: data.role, profile: db.profiles[data.role] });
    });

    socket.on('disconnect', () => {
        console.log('User disconnected:', socket.id);
    });
});

server.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
