/**
 * Módulo de agendamentos
 */

import { Router } from 'express';

import CreateUserService from '../services/CreateUserService';

const usersRouter = Router();

usersRouter.post('/', async (request, response) => {
    try {
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
    } catch (err) {
        return response.status(400).json({ error: err.message });
    }
});

export default usersRouter;
