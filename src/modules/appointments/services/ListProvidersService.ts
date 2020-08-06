import { injectable, inject } from 'tsyringe';

import User from '@modules/users/infra/typeorm/entities/User';
import IUsersRepository from '@modules/users/repositories/IUsersRepository';

interface IResquest {
    userId: string;
}

@injectable()
class ListProvidersService {
    private usersRepository: IUsersRepository;

    constructor(@inject('UsersRepository') repository: IUsersRepository) {
        this.usersRepository = repository;
    }

    public async execute({ userId }: IResquest): Promise<User[]> {
        const users = await this.usersRepository.findAllProviders({
            exceptUserId: userId,
        });

        return users;
    }
}

export default ListProvidersService;
