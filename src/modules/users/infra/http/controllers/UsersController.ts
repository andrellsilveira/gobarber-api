import { Request, Response } from 'express';
import { container } from 'tsyringe';
import { classToClass } from 'class-transformer';

import CreateUserService from '@modules/users/services/CreateUserService';

/**
 * Seguindo os princípios da arquitetura RESTFUL um controlador não deve ter mais de 5
 * métodos:
 * - index: Retornar uma lista de registros
 * - show: Retornar um único registro
 * - create: Inserir um registro
 * - update: Atualizar um registro
 * - delete: Excluir um registro
 */

class UsersController {
    public async create(
        request: Request,
        response: Response,
    ): Promise<Response> {
        const { name, email, password } = request.body;

        /**
         * Instancia a classe de serviço do usuário e realiza as injeções de código que
         * que foram configuradas anteriormente
         */
        const createUser = container.resolve(CreateUserService);

        const user = await createUser.execute({
            name,
            email,
            password,
        });

        /**
         * Elimina o atributo dentro dessa instância do objeto
         * Nesse caso fazemos isso para não retornar a senha, por questões de segurança
         * */
        // delete user.password;

        /**
         * O método "classToClass" da biblioteca Class Transformer aplica as transformações
         * definidas para a classe aos dados que serão retornados
         */
        return response.json(classToClass(user));
    }
}

export default UsersController;
