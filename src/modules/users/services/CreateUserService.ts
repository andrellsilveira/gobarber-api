import { injectable, inject } from 'tsyringe';

import AppError from '@shared/errors/AppError';
import User from '@modules/users/infra/typeorm/entities/User';
import IUsersRepository from '@modules/users/repositories/IUsersRepository';
import IHashProvider from '@modules/users/providers/HashProvider/models/IHashProvider';
import ICacheProvider from '@shared/container/providers/CacheProvider/models/ICacheProvider';

interface IRequest {
    name: string;
    email: string;
    password: string;
}

/** Identifica que a classe recebe injeção de código */
@injectable()
class CreateUserService {
    private usersRepository: IUsersRepository;

    private hashProvider: IHashProvider;

    private cacheProvider: ICacheProvider;

    constructor(
        /** Identifica o recurso a ser injetado como parâmetro */
        @inject('UsersRepository') repository: IUsersRepository,
        @inject('HashProvider') provider: IHashProvider,
        @inject('CacheProvider') cache: ICacheProvider,
    ) {
        this.usersRepository = repository;
        this.hashProvider = provider;
        this.cacheProvider = cache;
    }

    public async execute(data: IRequest): Promise<User> {
        const checkUserExists = await this.usersRepository.findByEmail(
            data.email,
        );

        if (checkUserExists) {
            throw new AppError('O e-mail informado já está sendo utilizado.');
        }

        const hashedPassword = await this.hashProvider.generateHash(
            data.password,
        );

        const user = await this.usersRepository.create({
            name: data.name,
            email: data.email,
            password: hashedPassword,
        });

        /**
         * Invalida os caches que contenham o prefixo passado para o método
         */
        await this.cacheProvider.invalidatePrefix('providers-list');

        return user;
    }
}

export default CreateUserService;
