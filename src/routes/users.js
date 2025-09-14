import { Router } from 'express';
import User from '../models/User.js';
import { ensureAdmin } from '../middlewares/auth.js';

const r = Router();

// GET a list all users
r.get('/', ensureAdmin, async (req, res, next) => {
    try {
        const users = await User.findAll();
        const adminCount = users.filter(u => u.role === 'admin').length;
        res.render('users/index', { users, title: 'Użytkownicy', adminCount });
    } catch (err) {
        next(err);
    }
});

// PUT - update user
r.put('/:id', ensureAdmin, async (req, res, next) => {
    try {
        const user = await User.findByPk(req.params.id);
        if (!user) return res.status(404).send('Nie znaleziono zasobu!');
        await user.update({ username: req.body.username, role: req.body.role });
        res.redirect('/users');
    } catch (err) {
        next(err);
    }
});

// DELETE user
r.delete('/:id', ensureAdmin, async (req, res, next) => {
    try {
        const user = await User.findByPk(req.params.id);
        if (!user) return res.status(404).send('Nie znaleziono zasobu!');
        if (user.role === 'admin') {
            const adminCount = await User.count({ where: { role: 'admin' } });
            if (adminCount <= 1) {
                return res.status(400).render('error', { status: 400, message: 'Nie można usunąć jedynego administratora' });
            }
        }
        await user.destroy();
        res.redirect('/users');
    } catch (err) {
        next(err);
    }
});

export default r;