import { Router } from 'express';
import bcrypt from 'bcryptjs';
import { User } from '../models/User.js';

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
    req.session.user = {
        id: user.id,
        username: user.username,
        role: user.role
    };
    res.redirect('/');
});

export default r;