import express from 'express';
import session from 'express-session';
import path from 'path';
import authRouter from './routes/auth.js';

const PORT = 3000;
const app = express();

app.use(express.urlencoded({ extended: false }))

app.use(session({
    secret: 'placeholder',
    resave: false,
    saveUninitialized: false
}));

app.use((req, res, next) => {
    res.locals.currentUser = req.session.user;
});

app.set('view engine', 'pug');
app.set('views', join(__dirname, 'views'))

app.use('/auth', authRouter);

app.get('/', (req, res) => {
    res.render('index', { title: 'PAI Projekt 1.', message: 'TEST' });
});

app.listen(PORT, () => console.log(`Serwer nasłuchuje na http://localhost:${PORT}`));