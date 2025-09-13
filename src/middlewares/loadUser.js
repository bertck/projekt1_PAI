import User from "../models/User.js";

export async function loadUser(req, res, next) {
    const userId = req.session.userId;
    if (!userId) {
        res.locals.currentUser = null;
        return next()
    }

    try {
        const user = await User.findByPk(userId, {
            attributes: ['id', 'email', 'username', 'role']
        });
        if (!user) {
            req.session.destroy(() => { });
            res.locals.currentUser = null;
            return next();
        }
        res.locals.currentUser = user;
        return next();
    } catch (err) {
        return next(err);
    }
}