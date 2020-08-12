import { Router } from 'express';
/**
 * Biblioteca para gerenciamento do upload de arquivos
 */
import multer from 'multer';
/**
 * Biblioteca para validação dos dados recebidos por uma rota da aplicação
 */
import { celebrate, Segments, Joi } from 'celebrate';

import ensureAuthenticated from '@modules/users/infra/http/middlewares/ensureAuthenticated';
import uploadConfig from '@config/upload';

import UsersController from '@modules/users/infra/http/controllers/UsersController';
import UserAvatarController from '@modules/users/infra/http/controllers/UserAvatarController';

const usersRouter = Router();

/**
 * Cria uma instância do Multer utilizando as configurações definidas no arquivo
 * "config/upload.ts"
 */
const upload = multer(uploadConfig.multer);

/**
 * Cria a instância do controlador
 */
const usersController = new UsersController();
const userAvatarController = new UserAvatarController();

usersRouter.post(
    '/',
    celebrate({
        /** Definição do seguimento da rota cujos dados serão validados */
        [Segments.BODY]: {
            name: Joi.string().required(),
            email: Joi.string().email().required(),
            password: Joi.string().required(),
        },
    }),
    usersController.create,
);

/**
 * Realiza a alteração do avatar do usuário, onde a chamada do método "upload.single('avatar')"
 * significa que será realizado upload da imagem enviada pelo parâmetro 'avatar'. A descrição
 * "single" identifica que será realizado o upload de apenas um arquivo por vez
 */
usersRouter.patch(
    '/avatar',
    ensureAuthenticated,
    upload.single('avatar'),
    userAvatarController.update,
);

export default usersRouter;
