import { injectable, inject } from 'tsyringe';
import { differenceInHours } from 'date-fns';

import AppError from '@shared/errors/AppError';
import IUsersRepository from '@modules/users/repositories/IUsersRepository';
import IUserTokensRepository from '@modules/users/repositories/IUserTokensRepository';
import IHashProvider from '@modules/users/providers/HashProvider/models/IHashProvider';

interface IRequest {
    token: string;
    password: string;
}

/** Identifica que a classe recebe injeção de código */
@injectable()
class ResetPasswordService {
    private usersRepository: IUsersRepository;

    private userTokensRepository: IUserTokensRepository;

    private hashProvider: IHashProvider;

    constructor(
        /** Identifica o recurso a ser injetado como parâmetro */
        @inject('UsersRepository') repository: IUsersRepository,
        @inject('UserTokensRepository') tokensRepository: IUserTokensRepository,
        @inject('HashProvider') provider: IHashProvider,
    ) {
        this.usersRepository = repository;
        this.userTokensRepository = tokensRepository;
        this.hashProvider = provider;
    }

    public async execute({ token, password }: IRequest): Promise<void> {
        const userToken = await this.userTokensRepository.findByToken(token);

        if (!userToken) {
            throw new AppError('Token de uUsuário não existe.');
        }

        const user = await this.usersRepository.findById(userToken.user_id);

        if (!user) {
            throw new AppError('Usuário não existe.');
        }

        const tokenCreatedAt = userToken.created_at;

        if (differenceInHours(Date.now(), tokenCreatedAt) > 2) {
            throw new AppError('Token expirado.');
        }

        user.password = await this.hashProvider.generateHash(password);

        await this.usersRepository.save(user);
    }
}

export default ResetPasswordService;
