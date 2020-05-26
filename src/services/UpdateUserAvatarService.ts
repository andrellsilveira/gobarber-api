import { getRepository } from 'typeorm';
import path from 'path';
import fs from 'fs';

import AppError from '../errors/AppError';
import User from '../models/User';
import uploadConfig from '../config/upload';

interface RequestDTO {
    userId: string;
    avatarFileName: string;
}

class UpdateUserAvatarService {
    public async execute({
        userId,
        avatarFileName,
    }: RequestDTO): Promise<User> {
        const usersRepository = getRepository(User);

        const user = await usersRepository.findOne(userId);

        if (!user) {
            throw new AppError(
                'Somente usuários autenticados podem alterar o avatar.',
                401,
            );
        }

        /**
         * Verifica se o usuário já possui avatar definido, em caso positivo, exclui
         */
        if (user.avatar) {
            /**
             * Recupera o arquivo de avatar do usuário
             */
            const userAvatarFilePath = path.join(
                uploadConfig.directory,
                user.avatar,
            );

            /**
             * Verifica se o arquivo existe
             */
            const userAvatarFileExists = await fs.promises.stat(
                userAvatarFilePath,
            );

            if (userAvatarFileExists) {
                /**
                 * Exclui o arquivo
                 */
                await fs.promises.unlink(userAvatarFilePath);
            }
        }

        /**
         * Atualiza o avatar do usuário com o novo arquivo
         */
        user.avatar = avatarFileName;

        /**
         * Salva as alterações realizadas no usuário
         */
        usersRepository.save(user);

        return user;
    }
}

export default UpdateUserAvatarService;
