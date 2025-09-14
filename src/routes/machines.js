import { Router } from 'express';
import Machine from '../models/Machine.js';
import { ensureAdmin } from '../middlewares/auth.js';

const r = Router();
const INVALID_DATA_MSG = 'Nieprawidłowe dane wejściowe';

// GET a list of all machines
r.get('/', async (req, res) => {
    const machines = await Machine.findAll();
    res.render('machines/index', { machines, title: 'Lista maszyn' });
});

// GET an 'add a new machine' page
r.get('/new', ensureAdmin, (req, res) => {
    res.render('machines/new', { title: 'Dodaj maszynę' });
});

// GET data of one particular machine
r.get('/:id', async (req, res, next) => {
    try {
        const machine = await Machine.findByPk(req.params.id);
        if (!machine) return next({ status: 404, message: 'Nie znaleziono zasobu!' });
        res.render('machines/show', { machine, title: machine.name });
    } catch (error) {
        next(error);
    }
});

// GET an edit page for one particular machine
r.get('/:id/edit', ensureAdmin, async (req, res, next) => {
    try {
        const machine = await Machine.findByPk(req.params.id);
        if (!machine) return next({ status: 404, message: 'Nie znaleziono zasobu!' });
        res.render('machines/edit', { machine, title: 'Edytuj maszynę' });
    } catch (error) {
        next(error);
    }
});

// POST a new machine
r.post('/', ensureAdmin, async (req, res, next) => {
    try {
        const { name, description = '' } = req.body;
        if (!name || name.length < 5 || name.length > 20 || description.length > 100) {
            return res.status(400).render('error', { status: 400, message: INVALID_DATA_MSG });
        }
        await Machine.create({ name, description });
        res.redirect('/machines');
    } catch (error) {
        next(error);
    }
});

// PUT - edit existing machine
r.put('/:id', ensureAdmin, async (req, res, next) => {
    try {
        const { name, description = '' } = req.body;
        if (!name || name.length < 5 || name.length > 20 || description.length > 100) {
            return res.status(400).render('error', { status: 400, message: INVALID_DATA_MSG });
        }
        const machine = await Machine.findByPk(req.params.id);
        if (!machine) return next({ status: 404, message: 'Nie znaleziono zasobu!' });
        await machine.update({ name, description });
        res.redirect('/machines');
    } catch (error) {
        next(error);
    }
});

// DELETE a machine
r.delete('/:id', ensureAdmin, async (req, res, next) => {
    try {
        const machine = await Machine.findByPk(req.params.id);
        if (!machine) return next({ status: 404, message: 'Nie znaleziono zasobu!' });
        await machine.destroy();
        res.redirect('/machines');
    } catch (error) {
        next(error);
    }
});

export default r;