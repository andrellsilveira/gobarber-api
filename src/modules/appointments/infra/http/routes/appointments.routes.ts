/**
 * Módulo de agendamentos
 */

import { Router } from 'express';
/**
 * Biblioteca para validação dos dados recebidos por uma rota da aplicação
 */
import { celebrate, Segments, Joi } from 'celebrate';

/**
 * Importa o middleware de autenticação
 */
import ensureAuthenticated from '@modules/users/infra/http/middlewares/ensureAuthenticated';

import AppointmentsController from '@modules/appointments/infra/http/controllers/AppointmentsController';
import ProviderAppointmentsController from '@modules/appointments/infra/http/controllers/ProviderAppointmentsController';

/** Instancia o express */
const appointmentsRouter = Router();

/** Cria uma instância do controlador */
const appointmentsController = new AppointmentsController();
const providerAppointmentsController = new ProviderAppointmentsController();

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
appointmentsRouter.post(
    '/',
    celebrate({
        /** Definição do seguimento da rota cujos dados serão validados */
        [Segments.BODY]: {
            provider_id: Joi.string().uuid().required(),
            date: Joi.date().required(),
        },
    }),
    appointmentsController.create,
);

appointmentsRouter.get('/me', providerAppointmentsController.index);

export default appointmentsRouter;
