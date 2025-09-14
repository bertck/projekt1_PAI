import { Router } from 'express';
import bcrypt from 'bcryptjs';
import User from '../models/User.js';
import { ensureAdmin } from '../middlewares/auth.js';

const r = Router();

r.use(ensureAdmin);

// GET a list all users
r.get('/', async (req, res, next) => {
    try {
        const users = await User.findAll({
            attributes: ['id', 'email', 'username', 'role']
        });
        res.render('users/index', {
            title: 'Wypożyczalnia: Zarządzanie użytkownikami',
            users
        });
    } catch (err) {
        next(err);
    }
});

// PUT - update user
r.put('/:id', async (req, res, next) => {
    try {
        const { newUsername, newPassword } = req.body;
        const user = await User.findByPk(req.params.id);
        if (!user) return res.redirect('/users');
        if (newUsername) user.username = newUsername;
        if (newPassword) user.passwordHash = await bcrypt.hash(newPassword, 10);
        await user.save();
        res.redirect('/users');
    } catch (err) {
        next(err);
    }
});

// DELETE user
r.delete('/:id', async (req, res, next) => {
    try {
        await User.destroy({ where: { id: req.params.id } });
        res.redirect('/users');
    } catch (err) {
        next(err);
    }
});

export default r;