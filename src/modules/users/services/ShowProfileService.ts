import { injectable, inject } from 'tsyringe';

import AppError from '@shared/errors/AppError';
import User from '@modules/users/infra/typeorm/entities/User';
import IUsersRepository from '@modules/users/repositories/IUsersRepository';

interface IResquest {
    userId: string;
}

@injectable()
class ShowProfileService {
    private usersRepository: IUsersRepository;

    constructor(@inject('UsersRepository') repository: IUsersRepository) {
        this.usersRepository = repository;
    }

    public async execute({ userId }: IResquest): Promise<User> {
        const user = await this.usersRepository.findById(userId);

        if (!user) {
            throw new AppError(
                'Somente usuários autenticados podem visualizar o perfil.',
                401,
            );
        }

        delete user.password;

        return user;
    }
}

export default ShowProfileService;
