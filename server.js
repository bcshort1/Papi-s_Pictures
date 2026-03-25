const express = require('express');
const path = require('path');
const app = express();
const PORT = 3000;

const db = require('./db.json');

const staticOptions = {
    dotfiles: 'deny',
    etag: true,
    index: false,
    maxAge: '0'
};

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.use(express.static(path.join(__dirname, 'public'), staticOptions));
app.use('/assets', express.static(path.join(__dirname, 'assets'), staticOptions));
app.use('/media', express.static(path.join(__dirname, 'media', 'media_display'), staticOptions));

app.get('/api', (req, res) => {
    res.json(db);
});

app.get('/api/recentPictures', (req, res) => {
    res.json(db.recentPictures || []);
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
