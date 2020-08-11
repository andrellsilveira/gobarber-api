import { Request, Response } from 'express';
import { container } from 'tsyringe';
import { classToClass } from 'class-transformer';

import CreateSessionService from '@modules/users/services/CreateSessionService';

class SessionsController {
    public async create(
        request: Request,
        response: Response,
    ): Promise<Response> {
        const { email, password } = request.body;

        const createSession = container.resolve(CreateSessionService);

        const { user, token } = await createSession.execute({
            email,
            password,
        });

        return response.json({
            /**
             * O método "classToClass" da biblioteca Class Transformer aplica as transformações
             * definidas para a classe aos dados que serão retornados
             */
            user: classToClass(user),
            token,
        });
    }
}

export default SessionsController;
