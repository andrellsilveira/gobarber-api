import { injectable, inject } from 'tsyringe';
import { classToClass } from 'class-transformer';

import User from '@modules/users/infra/typeorm/entities/User';
import IUsersRepository from '@modules/users/repositories/IUsersRepository';
import ICacheProvider from '@shared/container/providers/CacheProvider/models/ICacheProvider';

interface IResquest {
    userId: string;
}

@injectable()
class ListProvidersService {
    private usersRepository: IUsersRepository;

    private cacheProvider: ICacheProvider;

    constructor(
        @inject('UsersRepository') repository: IUsersRepository,
        @inject('CacheProvider') cache: ICacheProvider,
    ) {
        this.usersRepository = repository;
        this.cacheProvider = cache;
    }

    public async execute({ userId }: IResquest): Promise<User[]> {
        let users = await this.cacheProvider.recover<User[]>(
            `providers-list:${userId}`,
        );

        if (!users) {
            users = await this.usersRepository.findAllProviders({
                exceptUserId: userId,
            });

            /**
             * Realiza a gravação do cache
             */
            await this.cacheProvider.save(
                `providers-list:${userId}`,
                classToClass(users),
            );
        }

        return users;
    }
}

export default ListProvidersService;
