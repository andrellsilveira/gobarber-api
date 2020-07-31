import { injectable, inject } from 'tsyringe';

import AppError from '@shared/errors/AppError';
import User from '@modules/users/infra/typeorm/entities/User';
import IUsersRepository from '@modules/users/repositories/IUsersRepository';
import IStorageProvider from '@shared/container/providers/StorageProvider/models/IStorageProvider';

interface IResquest {
    userId: string;
    avatarFileName: string;
}

@injectable()
class UpdateUserAvatarService {
    private usersRepository: IUsersRepository;

    private storageProvider: IStorageProvider;

    constructor(
        @inject('UsersRepository') repository: IUsersRepository,
        @inject('StorageProvider') provider: IStorageProvider,
    ) {
        this.usersRepository = repository;
        this.storageProvider = provider;
    }

    public async execute({ userId, avatarFileName }: IResquest): Promise<User> {
        const user = await this.usersRepository.findById(userId);

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
             * Exclui o arquivo através do provider
             */
            await this.storageProvider.deleteFile(user.avatar);
        }

        /**
         * Atualiza o avatar do usuário com o novo arquivo
         */
        const fileName = await this.storageProvider.saveFile(avatarFileName);

        user.avatar = fileName;

        /**
         * Salva as alterações realizadas no usuário
         */
        await this.usersRepository.save(user);

        return user;
    }
}

export default UpdateUserAvatarService;
