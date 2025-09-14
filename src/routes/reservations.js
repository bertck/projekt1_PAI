import { Router } from 'express';
import Reservation from '../models/Reservation.js';
import Machine from '../models/Machine.js';

const r = Router();

// GET list of reservations, optionally filtered by machine
r.get('/', async (req, res, next) => {
    try {
        const where = {};
        let machine = null;
        if (req.query.machineId) {
            where.machineId = req.query.machineId;
            machine = await Machine.findByPk(req.query.machineId);
            if (!machine) return res.status(404).send("Nie znaleziono zasobu!");
        }
        const reservations = await Reservation.findAll({ where, include: Machine, order: [['startDate', 'ASC']] });
        res.render('reservations/index', { reservations, machine });
    } catch (error) {
        next(error);
    }
});

// GET form for creating a new reservation
r.get('/new', async (req, res, next) => {
    try {
        const machines = await Machine.findAll();
        const where = {};
        if (req.query.machineId) where.machineId = req.query.machineId;
        const reservations = await Reservation.findAll({ where, include: Machine, order: [['startDate', 'ASC']] });
        res.render('reservations/new', { machines, selectedMachineId: req.query.machineId, reservations });
    } catch (error) {
        next(error);
    }
})

// GET one reservation
r.get('/:id', async (req, res, next) => {
    try {
        const reservation = await Reservation.findByPk(req.params.id, { include: Machine });
        if (!reservation) return res.status(404).send("Nie znaleziono zasobu!");
        res.render('reservations/show', { reservation });
    } catch (error) {
        next(error);
    }
});

// GET form for editing a reservation
r.get('/:id/edit', async (req, res, next) => {
    try {
        const reservation = await Reservation.findByPk(req.params.id);
        if (!reservation) return res.status(404).send('Nie znaleziono zasobu!');
        const currentUser = res.locals.currentUser;
        if (reservation.userId !== currentUser.id && currentUser.role !== 'admin') {
            return res.status(403).send("Odmówiono dostępu!");
        }
        const machines = await Machine.findAll();
        res.render('reservations/edit', { reservation, machines });
    } catch (error) {
        next(error);
    }
});

// POST create reservation
r.post('/', async (req, res, next) => {
    try {
        const { machineId, startDate, endDate } = req.body;
        const machine = await Machine.findByPk(machineId);
        if (!machine) return res.status(404).send("Nie znaleziono zasobu");
        // TODO: dodać weryfikację czy nie ma już istniejącej rezerwacji na tę maszynę w danym terminie
        await Reservation.create({ machineId, startDate, endDate, userId: req.session.userId });
        res.redirect(`/reservations?machineId=${machineId}`);
    } catch (error) {
        next(error);
    }
});

// PUT update reservation
r.put('/:id', async (req, res, next) => {
    try {
        const reservation = await Reservation.findByPk(req.params.id);
        if (!reservation) return res.status(404).send('Nie znaleziono zasobu!');
        const currentUser = res.locals.currentUser;
        if (reservation.userId !== currentUser.id && currentUser.role !== 'admin') {
            return res.status(403).send('Odmówiono dostępu!');
        }
        const { machineId, startDate, endDate } = req.body;
        // TODO: dodać weryfikację czy po zmianie machineId, startDate lub endDate nie będzie konfliktu w bazie
        await reservation.update({
            machineId,
            startDate,
            endDate
        });
        res.redirect(`/reservations/${reservation.id}`);
    } catch (error) {
        next(error);
    }
});

// DELETE a reservation
r.delete('/:id', async (req, res, next) => {
    try {
        const reservation = await Reservation.findByPk(req.params.id);
        if (!reservation) return res.status(404).send('Nie znaleziono zasobu!');
        const currentUser = res.locals.currentUser;
        if (reservation.userId !== currentUser.id && currentUser.role !== 'admin') {
            return res.status(403).send('Odmówiono dostępu!');
        }
        const machineId = reservation.machineId;
        await reservation.destroy();
        res.redirect(`/reservations?machineId=${machineId}`);
    } catch (error) {
        next(error);
    }
});

export default r;