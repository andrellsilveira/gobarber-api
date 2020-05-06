/**
 * Módulo de agendamentos
 */

import { Router } from 'express';
import { parseISO } from 'date-fns';

/**
 * Importa a classe AppointmentsRepository
 */
import AppointmentsRepository from '../repositories/AppointmentsRepository';
/**
 * Importa o service de criação de um agendamento
 */
import CreateAppointmentService from '../services/CreateAppointmentService';

/** Instancia o express */
const appointmentsRouter = Router();

/** Importa o repositório */
const appointmentsRepository = new AppointmentsRepository();

appointmentsRouter.get('/', (request, response) => {
    const appointments = appointmentsRepository.all();

    return response.json(appointments);
});

/**
 * Não é necessário apontar o recurso na rota "/appointments", pois essa indicação já está
 * sendo realizada no arquivo index.ts
 */
appointmentsRouter.post('/', (request, response) => {
    try {
        const { provider, date } = request.body;

        /**
         * Converte a data para o formato ISO
         * */
        const parsedDate = parseISO(date);

        const createAppointment = new CreateAppointmentService(
            appointmentsRepository,
        );

        const appointment = createAppointment.execute({
            provider,
            date: parsedDate,
        });

        return response.json(appointment);
    } catch (err) {
        return response.status(400).json({ error: err.message });
    }
});

export default appointmentsRouter;
