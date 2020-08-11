import { Request, Response } from 'express';
import { container } from 'tsyringe';
import { classToClass } from 'class-transformer';

import UploadUserAvatarService from '@modules/users/services/UpdateUserAvatarService';

/**
 * Seguindo os princípios da arquitetura RESTFUL um controlador não deve ter mais de 5
 * métodos:
 * - index: Retornar uma lista de registros
 * - show: Retornar um único registro
 * - create: Inserir um registro
 * - update: Atualizar um registro
 * - delete: Excluir um registro
 */

class UserAvatarController {
    public async update(
        request: Request,
        response: Response,
    ): Promise<Response> {
        const uploadAvatar = container.resolve(UploadUserAvatarService);

        const user = await uploadAvatar.execute({
            userId: request.user.id,
            avatarFileName: request.file.filename,
        });

        return response.json(classToClass(user));
    }
}

export default UserAvatarController;
