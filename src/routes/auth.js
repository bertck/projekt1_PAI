import { Router } from 'express';
import bcrypt from 'bcryptjs';
import User from '../models/User.js';

const r = Router();
const EMAIL_REGEX = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;
const USERNAME_REGEX = /^[A-Za-z0-9]{3,20}$/;
const INVALID_DATA_MSG = 'Nieprawidłowe dane wejściowe';

r.get('/login', (req, res) => {
    res.render('login', { title: 'Wypożyczalnia: Zaloguj się' });
});

r.post('/login', async (req, res) => {
    const { email, password } = req.body;
    if (!EMAIL_REGEX.test(email) || !password) {
        return res.status(400).render('error', { status: 400, message: INVALID_DATA_MSG });
    }
    const user = await User.findOne({ where: { email } });

    if (!user || !(await bcrypt.compare(password, user.passwordHash))) {
        return res.render('login', { error: 'Nieprawidłowa nazwa użytkownika lub hasło', title: 'Wypożyczalnia: Zaloguj się' });
    }

    req.session.userId = user.id;
    res.redirect('/');
});

r.get('/logout', (req, res) => {
    req.session.destroy(() => res.redirect('/auth/login'));
});

r.get('/register', (req, res) => {
    res.render('register', { title: 'Wypożyczalnia: Zarejestruj się' });
});

r.post('/register', async (req, res) => {
    const { email, username, password } = req.body;
    if (!EMAIL_REGEX.test(email) || !USERNAME_REGEX.test(username) || password.length < 6) {
        return res.status(400).render('error', { status: 400, message: INVALID_DATA_MSG });
    }
    const passwordHash = await bcrypt.hash(password, 10);
    const user = await User.create({ email, username, passwordHash, role: 'user' });
    req.session.userId = user.id;
    res.redirect('/');
});

export default r;