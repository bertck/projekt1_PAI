import express from 'express';
import session from 'express-session';
import sequelize from './db/index.js';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import authRouter from './routes/auth.js';
import { ensureAuthenticated } from './middlewares/auth.js';
import seed from './db/seed.js';
import fs from 'fs';

const PORT = 3000;
const app = express();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const dbPath = join(__dirname, 'db/data/database.sqlite')
const seed = !fs.existsSync(dbPath);

await sequelize.authenticate();
await sequelize.sync();

if (seed) await seed();

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

app.use(ensureAuthenticated);
app.get('/', (req, res) => {
    res.render('index', { title: 'PAI Projekt 1.', message: 'TEST' });
});

app.listen(PORT, () => console.log(`Serwer nasłuchuje na http://localhost:${PORT}`));