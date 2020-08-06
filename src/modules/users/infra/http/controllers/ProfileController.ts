import { Request, Response } from 'express';
import { container } from 'tsyringe';

import ShowProfileService from '@modules/users/services/ShowProfileService';
import UpdateProfileService from '@modules/users/services/UpdateProfileService';

/**
 * Seguindo os princípios da arquitetura RESTFUL um controlador não deve ter mais de 5
 * métodos:
 * - index: Retornar uma lista de registros
 * - show: Retornar um único registro
 * - create: Inserir um registro
 * - update: Atualizar um registro
 * - delete: Excluir um registro
 */

class ProfileController {
    public async show(request: Request, response: Response): Promise<Response> {
        const userId = request.user.id;
        const showProfile = container.resolve(ShowProfileService);

        const user = await showProfile.execute({ userId });

        return response.json(user);
    }

    public async update(
        request: Request,
        response: Response,
    ): Promise<Response> {
        const userId = request.user.id;
        const { name, email, oldPassword, password } = request.body;

        /**
         * Instancia a classe de serviço do usuário e realiza as injeções de código que
         * que foram configuradas anteriormente
         */
        const updateProfile = container.resolve(UpdateProfileService);

        const user = await updateProfile.execute({
            userId,
            name,
            email,
            oldPassword,
            password,
        });

        /**
         * Elimina o atributo dentro dessa instância do objeto
         * Nesse caso fazemos isso para não retornar a senha, por questões de segurança
         * */
        delete user.password;

        return response.json(user);
    }
}

export default ProfileController;
