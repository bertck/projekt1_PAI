import User from "../models/User.js";

export function ensureAuthenticated(req, res, next) {
    if (req.session.userId) return next();
    res.redirect('/auth/login');
}

export function ensureAdmin(req, res, next) {
    const userId = req.session.userId;
    if (!userId) res.redirect('/auth/login');
    try {
        const user = User.findByPk(userId);
        if (user && user.role == 'admin') return next();
    } catch (error) {
        return next(error);
    }
    res.status(403).send('Odmówiono dostępu!');
}