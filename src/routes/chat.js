const express = require('express');
const router = express.Router();
const fs = require('fs');
const path = require('path');

const dbPath = path.join(__dirname, '../data/db.json');

// Get chat history
router.get('/history/:roomId', (req, res) => {
    const { roomId } = req.params;
    try {
        const data = JSON.parse(fs.readFileSync(dbPath, 'utf8'));
        const history = data.messages ? data.messages.filter(m => m.roomId === roomId) : [];
        res.json(history);
    } catch (error) {
        res.status(500).json({ error: 'Could not load chat history' });
    }
});

module.exports = router;
