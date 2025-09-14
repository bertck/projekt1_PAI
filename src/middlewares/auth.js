export function ensureAuthenticated(req, res, next) {
    if (req.session.userId) return next();
    return res.redirect('/auth/login');
}

export function ensureAdmin(req, res, next) {
    const user = res.locals.currentUser;
    if (!user) return res.redirect('/auth/login');
    if (user.role === 'admin') return next();
    next({ status: 403, message: 'Odmówiono dostępu!' });
}