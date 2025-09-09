import express from 'express';
import session from 'express-session';
import sequelize from './db/index.js';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import authRouter from './routes/auth.js';

const PORT = 3000;
const app = express();

await sequelize.authenticate();
await sequelize.sync();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

app.use(express.urlencoded({ extended: false }))

app.use(session({
    secret: 'placeholder',
    resave: false,
    saveUninitialized: false
}));

app.use((req, res, next) => {
    res.locals.currentUser = req.session.user;
    next();
});

app.set('view engine', 'pug');
app.set('views', join(__dirname, 'views'))

app.use('/auth', authRouter);

app.get('/', (req, res) => {
    res.render('index', { title: 'PAI Projekt 1.', message: 'TEST' });
});

app.listen(PORT, () => console.log(`Serwer nasłuchuje na http://localhost:${PORT}`));