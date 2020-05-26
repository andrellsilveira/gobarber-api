/**
 * Módulo de agendamentos
 */

import { Router } from 'express';
import multer from 'multer';

import CreateUserService from '../services/CreateUserService';
import UploadUserAvatarService from '../services/UpdateUserAvatarService';
import ensureAuthenticated from '../middlewares/ensureAuthenticated';
import uploadConfig from '../config/upload';

const usersRouter = Router();

/**
 * Cria uma instância do Multer utilizando as configurações definidas no arquivo
 * "config/upload.ts"
 */
const upload = multer(uploadConfig);

usersRouter.post('/', async (request, response) => {
    const { name, email, password } = request.body;

    const createUser = new CreateUserService();

    const user = await createUser.execute({
        name,
        email,
        password,
    });

    /**
     * Elimina o atributo dentro dessa instância do objeto
     * Nesse caso fazemos isso para não retornar a senha, por questões de segurança
     * */
    delete user.password;

    return response.json(user);
});

/**
 * Realiza a alteração do avatar do usuário, onde a chamada do método "upload.single('avatar')"
 * significa que será realizado upload da imagem enviada pelo parâmetro 'avatar'. A descrição
 * "single" identifica que será realizado o upload de apenas um arquivo por vez
 */
usersRouter.patch(
    '/avatar',
    ensureAuthenticated,
    upload.single('avatar'),
    async (request, response) => {
        const uploadAvatar = new UploadUserAvatarService();

        const user = await uploadAvatar.execute({
            userId: request.user.id,
            avatarFileName: request.file.filename,
        });

        delete user.password;

        return response.json(user);
    },
);

export default usersRouter;
