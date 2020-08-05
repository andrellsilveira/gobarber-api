import { injectable, inject } from 'tsyringe';

import AppError from '@shared/errors/AppError';
import IUsersRepository from '@modules/users/repositories/IUsersRepository';
import IUserTokensRepository from '@modules/users/repositories/IUserTokensRepository';
import IMailProvider from '@shared/container/providers/MailProvider/models/IMailProvider';

interface IRequest {
    email: string;
}

/** Identifica que a classe recebe injeção de código */
@injectable()
class SendForgotPasswordEmailService {
    private usersRepository: IUsersRepository;

    private mailProvider: IMailProvider;

    private userTokensRepository: IUserTokensRepository;

    constructor(
        /** Identifica o recurso a ser injetado como parâmetro */
        @inject('UsersRepository') repository: IUsersRepository,
        @inject('MailProvider') provider: IMailProvider,
        @inject('UserTokensRepository') tokensRepository: IUserTokensRepository,
    ) {
        this.usersRepository = repository;
        this.mailProvider = provider;
        this.userTokensRepository = tokensRepository;
    }

    public async execute({ email }: IRequest): Promise<void> {
        const user = await this.usersRepository.findByEmail(email);

        if (!user) {
            throw new AppError('Usuário informado não existe.');
        }

        this.userTokensRepository.generate(user.id);

        this.mailProvider.sendMail(
            email,
            'Pedido de recuperação de senha recebido',
        );
    }
}

export default SendForgotPasswordEmailService;
