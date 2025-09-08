const express = require('express');
const path = require('path');
const app = express();

// Pug setup
app.set('view engine', 'pug');

app.set('views', path.join(__dirname, 'views'))

app.get('/', (req, res) => {
    res.render('index', { title: 'PAI Projekt 1.', message: 'TEST'});
});

const PORT = 3000;
app.listen(PORT, () => console.log(`Serwer nasłuchuje na http://localhost:${PORT}`));