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

/**
 * Importa o middleware de autenticação
 */
import ensureAuthenticated from '../middlewares/ensureAuthenticated';

/** Instancia o express */
const appointmentsRouter = Router();

/**
 * Define o uso do middleware de autenticação para todas as rotas de agendamentos
 */
appointmentsRouter.use(ensureAuthenticated);

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
    const { provider_id, date } = request.body;

    /**
     * Converte a data para o formato ISO
     * */
    const parsedDate = parseISO(date);

    const createAppointment = new CreateAppointmentService();

    const appointment = await createAppointment.execute({
        provider_id,
        date: parsedDate,
    });

    return response.json(appointment);
});

export default appointmentsRouter;
