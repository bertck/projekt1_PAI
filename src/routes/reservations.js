import { Router } from 'express';
import Reservation, { Op } from '../models/Reservation.js';
import Machine from '../models/Machine.js';
import User from '../models/User.js';

const r = Router();
const INVALID_DATA_MSG = 'Nieprawidłowe dane wejściowe';

// GET list of reservations, optionally filtered by machine
r.get('/', async (req, res, next) => {
    try {
        const where = {};
        let machine = null;
        if (req.query.machineId) {
            where.machineId = req.query.machineId;
            machine = await Machine.findByPk(req.query.machineId);
            if (!machine) return next({ status: 404, message: 'Nie znaleziono zasobu!' });
        }
        const reservations = await Reservation.findAll({ where, include: [Machine, User], order: [['startDate', 'ASC']] });
        res.render('reservations/index', { reservations, machine, title: 'Lista rezerwacji' });
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
        const reservations = await Reservation.findAll({ where, include: [Machine, User], order: [['startDate', 'ASC']] });
        res.render('reservations/new', { machines, selectedMachineId: req.query.machineId, reservations, title: 'Nowa rezerwacja' });
    } catch (error) {
        next(error);
    }
});

// GET one reservation
r.get('/:id', async (req, res, next) => {
    try {
        const reservation = await Reservation.findByPk(req.params.id, { include: [Machine, User] });
        if (!reservation) return next({ status: 404, message: 'Nie znaleziono zasobu!' });
        res.render('reservations/show', { reservation, title: 'Szczegóły rezerwacji' });
    } catch (error) {
        next(error);
    }
});

// GET form for editing a reservation
r.get('/:id/edit', async (req, res, next) => {
    try {
        const reservation = await Reservation.findByPk(req.params.id);
        if (!reservation) return next({ status: 404, message: 'Nie znaleziono zasobu!' });
        const currentUser = res.locals.currentUser;
        if (reservation.userId !== currentUser.id && currentUser.role !== 'admin') {
            return next({ status: 403, message: 'Odmówiono dostępu!' });
        }
        const machines = await Machine.findAll();
        res.render('reservations/edit', { reservation, machines, title: 'Edytuj rezerwację' });
    } catch (error) {
        next(error);
    }
});

// POST create reservation
r.post('/', async (req, res, next) => {
    try {
        const { machineId, startDate, endDate } = req.body;
        const start = new Date(startDate);
        const end = new Date(endDate);
        const max = new Date();
        max.setMonth(max.getMonth() + 3);
        if (!machineId || !startDate || !endDate || start > end || start > max || end > max) {
            return res.status(400).render('error', { status: 400, message: INVALID_DATA_MSG });
        }
        const machine = await Machine.findByPk(machineId);
        if (!machine) return next({ status: 404, message: 'Nie znaleziono zasobu' });
        const conflict = await Reservation.findOne({
            where: {
                machineId,
                startDate: { [Op.lte]: endDate },
                endDate: { [Op.gte]: startDate }
            }
        });
        if (conflict) return next({ status: 400, message: 'Termin jest zajęty!' });
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
        if (!reservation) return next({ status: 404, message: 'Nie znaleziono zasobu' });
        const currentUser = res.locals.currentUser;
        if (reservation.userId !== currentUser.id && currentUser.role !== 'admin') {
            return next({ status: 403, message: 'Odmówiono dostępu!' });
        }
        const { machineId, startDate, endDate } = req.body;
        const start = new Date(startDate);
        const end = new Date(endDate);
        const max = new Date();
        max.setMonth(max.getMonth() + 3);
        if (!machineId || !startDate || !endDate || start > end || start > max || end > max) {
            return res.status(400).render('error', { status: 400, message: INVALID_DATA_MSG });
        }
        const conflict = await Reservation.findOne({
            where: {
                id: { [Op.ne]: reservation.id },
                machineId,
                startDate: { [Op.lte]: endDate },
                endDate: { [Op.gte]: startDate }
            }
        });
        if (conflict) return next({ status: 400, message: 'Termin jest zajęty!' });
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
        if (!reservation) return next({ status: 404, message: 'Nie znaleziono zasobu!' });
        const currentUser = res.locals.currentUser;
        if (reservation.userId !== currentUser.id && currentUser.role !== 'admin') {
            return next({ status: 403, message: 'Odmówiono dostępu!' });
        }
        const machineId = reservation.machineId;
        await reservation.destroy();
        res.redirect(`/reservations?machineId=${machineId}`);
    } catch (error) {
        next(error);
    }
});

export default r;