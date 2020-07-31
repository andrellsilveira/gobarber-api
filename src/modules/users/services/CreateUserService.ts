import { injectable, inject } from 'tsyringe';

import AppError from '@shared/errors/AppError';
import User from '@modules/users/infra/typeorm/entities/User';
import IUsersRepository from '@modules/users/repositories/IUsersRepository';
import IHashProvider from '@modules/users/providers/HashProvider/models/IHashProvider';

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

    constructor(
        /** Identifica o recurso a ser injetado como parâmetro */
        @inject('UsersRepository') repository: IUsersRepository,
        @inject('HashProvider') provider: IHashProvider,
    ) {
        this.usersRepository = repository;
        this.hashProvider = provider;
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

        return user;
    }
}

export default CreateUserService;
