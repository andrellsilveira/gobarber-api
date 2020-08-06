import { injectable, inject } from 'tsyringe';

import AppError from '@shared/errors/AppError';
import User from '@modules/users/infra/typeorm/entities/User';
import IUsersRepository from '@modules/users/repositories/IUsersRepository';
import IHashProvider from '@modules/users/providers/HashProvider/models/IHashProvider';

interface IResquest {
    userId: string;
    name: string;
    email: string;
    oldPassword?: string;
    password?: string;
}

@injectable()
class UpdateProfileService {
    private usersRepository: IUsersRepository;

    private hashProvider: IHashProvider;

    constructor(
        @inject('UsersRepository') repository: IUsersRepository,
        @inject('HashProvider') provider: IHashProvider,
    ) {
        this.usersRepository = repository;
        this.hashProvider = provider;
    }

    public async execute({
        userId,
        name,
        email,
        oldPassword,
        password,
    }: IResquest): Promise<User> {
        const user = await this.usersRepository.findById(userId);

        if (!user) {
            throw new AppError(
                'Somente usuários autenticados podem alterar o avatar.',
                401,
            );
        }

        const userWithSameEmail = await this.usersRepository.findByEmail(email);

        if (userWithSameEmail && userWithSameEmail.id !== userId) {
            throw new AppError('E-mail informado já está sendo utilizado.');
        }

        user.name = name;
        user.email = email;

        if (password && !oldPassword) {
            throw new AppError(
                'Para alterar a senha é necessário informar a atual.',
            );
        }

        if (password && oldPassword) {
            const checkOldPassword = await this.hashProvider.compareHash(
                oldPassword,
                user.password,
            );

            if (!checkOldPassword) {
                throw new AppError('A senha atual informada é inválida.');
            }

            user.password = await this.hashProvider.generateHash(password);
        }

        return this.usersRepository.save(user);
    }
}

export default UpdateProfileService;
