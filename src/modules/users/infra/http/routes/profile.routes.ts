import { Router } from 'express';
import { celebrate, Segments, Joi } from 'celebrate';

import ensureAuthenticated from '@modules/users/infra/http/middlewares/ensureAuthenticated';
import ProfileController from '@modules/users/infra/http/controllers/ProfileController';

const profileRouter = Router();

/**
 * Cria a instância do controlador
 */
const profileController = new ProfileController();

profileRouter.use(ensureAuthenticated);

profileRouter.get('/', profileController.show);

profileRouter.put(
    '/',
    celebrate({
        /** Definição do seguimento da rota cujos dados serão validados */
        [Segments.BODY]: {
            name: Joi.string().required(),
            email: Joi.string().email().required(),
            oldPassword: Joi.string(),
            password: Joi.string(),
            passwordConfirmation: Joi.string()
                /** Valida a informação de acordo com aquela definida para o campo referenciado */
                .valid(Joi.ref('password')),
        },
    }),
    profileController.update,
);

export default profileRouter;
