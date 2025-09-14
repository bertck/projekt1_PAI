import { Router } from 'express';
import User from '../models/User.js';
import { ensureAdmin } from '../middlewares/auth.js';

const r = Router();

// GET a list all users
r.get('/', ensureAdmin, async (req, res, next) => {
    try {
        const users = await User.findAll();
        res.render('users/index', { users, title: 'Użytkownicy' });
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
        await user.destroy();
        res.redirect('/users');
    } catch (err) {
        next(err);
    }
});

export default r;