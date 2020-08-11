import { Router } from 'express';
import { celebrate, Segments, Joi } from 'celebrate';

import SessionsController from '@modules/users/infra/http/controllers/SessionsController';

const sessionsRouter = Router();

/**
 * Cria a instância do controlador
 */
const sessionsController = new SessionsController();

sessionsRouter.post(
    '/',
    celebrate({
        /** Definição do seguimento da rota cujos dados serão validados */
        [Segments.BODY]: {
            email: Joi.string().email().required(),
            password: Joi.string().required(),
        },
    }),
    sessionsController.create,
);

export default sessionsRouter;
