import { injectable, inject } from 'tsyringe';
import path from 'path';

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

        const { token } = await this.userTokensRepository.generate(user.id);

        const forgotPasswordTemplate = path.resolve(
            __dirname,
            '..',
            'views',
            'forgot_password.hbs',
        );

        await this.mailProvider.sendMail({
            to: {
                name: user.name,
                email: user.email,
            },
            subject: '[GoBarber] Recuperação de Senha',
            templateData: {
                file: forgotPasswordTemplate,
                variables: {
                    name: user.name,
                    link: `http://localhost:3000/reset_password?token=${token}`,
                },
            },
        });
    }
}

export default SendForgotPasswordEmailService;
