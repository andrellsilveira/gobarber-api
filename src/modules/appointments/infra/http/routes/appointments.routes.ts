/**
 * Módulo de agendamentos
 */

import { Router } from 'express';

/**
 * Importa o middleware de autenticação
 */
import ensureAuthenticated from '@modules/users/infra/http/middlewares/ensureAuthenticated';

import AppointmentsController from '@modules/appointments/infra/http/controllers/AppointmentsController';

/** Instancia o express */
const appointmentsRouter = Router();

/** Cria uma instância do controlador */
const appointmentsController = new AppointmentsController();

/**
 * Define o uso do middleware de autenticação para todas as rotas de agendamentos
 */
appointmentsRouter.use(ensureAuthenticated);

// appointmentsRouter.get('/', async (request, response) => {
//     /** Instancia o repositório */
//     const appointmentsRepository = new AppointmentsRepository();
//     const appointments = await appointmentsRepository.find();

//     return response.json(appointments);
// });

/**
 * Não é necessário apontar o recurso na rota "/appointments", pois essa indicação já está
 * sendo realizada no arquivo index.ts
 */
appointmentsRouter.post('/', appointmentsController.create);

export default appointmentsRouter;
