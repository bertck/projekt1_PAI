import { Router } from 'express';
import bcrypt from 'bcryptjs';
import User from '../models/User.js';

const r = Router();

r.get('/login', (req, res) => {
    res.render('login', { title: 'Wypożyczalnia: Zaloguj się' });
});

r.post('/login', async (req, res) => {
    const { email, password } = req.body;
    const user = await User.findOne({ where: { email } });

    if (!user || !(await bcrypt.compare(password, user.passwordHash))) {
        return res.render('login', { error: 'Nieprawidłowa nazwa użytkownika lub hasło' });
    }

    req.session.userId = user.id;
    res.redirect('/');
});

r.get('/logout', (req, res) => {
    req.session.destroy(() => res.redirect('/login'));
});

r.get('/register', (req, res) => {
    res.render('register', { title: 'Wypożyczalnia: Zarejestruj się' });
});

r.post('/register', async (req, res) => {
    const { email, username, password } = req.body;
    const passwordHash = await bcrypt.hash(password, 10);
    const user = await User.create({ email, username, passwordHash, role: 'user' });
    req.session.userId = user.id;
    res.redirect('/');
});

export default r;