import 'dotenv/config';
import express from 'express';
import session from 'express-session';
import sequelize from './db/index.js';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import authRouter from './routes/auth.js';
import machinesRouter from './routes/machines.js';
import reservationsRouter from './routes/reservations.js';
import usersRouter from './routes/users.js';
import { ensureAuthenticated } from './middlewares/auth.js';
import seedDatabase from './db/seed.js';
import fs from 'fs';
import { loadUser } from './middlewares/loadUser.js';

const app = express();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const dbPath = process.env.DB_FILE_PATH || join(__dirname, 'db/data/database.sqlite')
const shouldSeed = !fs.existsSync(dbPath);

await sequelize.authenticate();
await sequelize.sync();

if (shouldSeed) await seedDatabase();

app.use(express.urlencoded({ extended: false }));
app.use(express.static(join(__dirname, 'public')));

app.use((req, res, next) => {
    // Changing POST to PUT od DELETE, because html forms support only POST
    if (req.body && req.body._method) {
        req.method = req.body._method.toUpperCase();
        delete req.body._method;
    }
    next();
});

app.use(session({
    secret: process.env.SESSION_SECRET || 'placeholder',
    resave: false,
    saveUninitialized: false
}));

app.use('/auth', authRouter);
app.use((req, res, next) => {
    if (['/auth/login', '/auth/register'].includes(req.path)) return next();
    return ensureAuthenticated(req, res, next);
});

app.use(loadUser);

app.set('view engine', 'pug');
app.set('views', join(__dirname, 'views'));

app.use('/machines', machinesRouter);
app.use('/reservations', reservationsRouter);
app.use('/users', usersRouter);
app.get('/', (req, res) => {
    res.render('index', { title: 'Wypożyczalnia: Strona główna' });
});

const PORT = process.env.SERVER_PORT || 3000;
app.listen(PORT, () => console.log(`Serwer nasłuchuje na http://localhost:${PORT}`));