const express = require('express');
const path = require('path');
const app = express();
const PORT = 3000;

const db = require ('./db.json');

app.use(express.static(path.join(__dirname, 'public')));
app.use('/media', express.static(path.join(__dirname, 'media', 'media_display')));

app.get('/api', (req, res) => {
    res.json(db);
});

app.get('/api/recentPictures', (req, res) => {
    res.json(db.recentPictures || []);
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});