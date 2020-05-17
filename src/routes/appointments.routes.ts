/**
 * Módulo de agendamentos
 */

import { Router } from 'express';
import { parseISO } from 'date-fns';
import { getCustomRepository } from 'typeorm';

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

appointmentsRouter.get('/', async (request, response) => {
    /**
     * Recupera o repositório e iniciliza-o na variável
     */
    const appointmentsRepository = getCustomRepository(AppointmentsRepository);
    const appointments = await appointmentsRepository.find();

    return response.json(appointments);
});

/**
 * Não é necessário apontar o recurso na rota "/appointments", pois essa indicação já está
 * sendo realizada no arquivo index.ts
 */
appointmentsRouter.post('/', async (request, response) => {
    try {
        const { provider, date } = request.body;

        /**
         * Converte a data para o formato ISO
         * */
        const parsedDate = parseISO(date);

        const createAppointment = new CreateAppointmentService();

        const appointment = await createAppointment.execute({
            provider,
            date: parsedDate,
        });

        return response.json(appointment);
    } catch (err) {
        return response.status(400).json({ error: err.message });
    }
});

export default appointmentsRouter;
