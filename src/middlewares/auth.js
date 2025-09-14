import User from "../models/User.js";

export function ensureAuthenticated(req, res, next) {
    if (req.session.userId) return next();
    return res.redirect('/auth/login');
}

export async function ensureAdmin(req, res, next) {
    const userId = req.session.userId;
    if (!userId) return res.redirect('/auth/login');
    try {
        const user = await User.findByPk(userId);
        if (user && user.role == 'admin') return next();
    } catch (error) {
        return next(error);
    }
    res.status(403).send('Odmówiono dostępu!');
}