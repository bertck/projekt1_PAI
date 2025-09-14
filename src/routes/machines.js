import { Router } from 'express';
import Machine from '../models/Machine.js';
import { ensureAdmin } from '../middlewares/auth.js';

const r = Router();

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
        if (!machine) return res.status(404).send('Nie znaleziono zasobu!');
        res.render('machines/show', { machine, title: machine.name });
    } catch (error) {
        next(error);
    }    
});

// GET an edit page for one particular machine
r.get('/:id/edit', ensureAdmin, async (req, res, next) => {
    try {
        const machine = await Machine.findByPk(req.params.id);
        if (!machine) return res.status(404).send('Nie znaleziono zasobu!');
        res.render('machines/edit', { machine, title: 'Edytuj maszynę' });
    } catch (error) {
        next(error);
    }
});

// POST a new machine
r.post('/', ensureAdmin, async (req, res, next) => {
    try {
        const { name, description } = req.body;
        await Machine.create({ name, description });
        // TODO: change redirect to something different?
        res.redirect('/machines');
    } catch (error) {
        next(error);
    }
});

// PUT - edit existing machine
r.put('/:id', ensureAdmin, async (req, res, next) => {
    try {
        const machine = await Machine.findByPk(req.params.id);
        if (!machine) return res.status(404).send('Nie znaleziono zasobu!');
        await machine.update({ name: req.body.name, description: req.body.description });
        // TODO: change redirect to something different?
        res.redirect('/machines');
    } catch (error) {
        next(error);
    }
});

// DELETE a machine
r.delete('/:id', ensureAdmin, async (req, res, next) => {
    try {
        const machine = await Machine.findByPk(req.params.id);
        if (!machine) return res.status(404).send('Nie znaleziono zasobu!');
        await machine.destroy();
        // TODO: change redirect to something different?
        res.redirect('/machines');
    } catch (error) {
        next(error);
    } 
});

export default r;