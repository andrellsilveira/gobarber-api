import { sign } from 'jsonwebtoken';
import { injectable, inject } from 'tsyringe';

import AppError from '@shared/errors/AppError';
import User from '@modules/users/infra/typeorm/entities/User';
import IUsersRepository from '@modules/users/repositories/IUsersRepository';
import IHashProvider from '@modules/users/providers/HashProvider/models/IHashProvider';

import authConfig from '@config/auth';

interface IRequest {
    email: string;
    password: string;
}

interface IResponse {
    user: User;
    token: string;
}

@injectable()
class CreateSessionService {
    private usersRepository: IUsersRepository;

    private hashProvider: IHashProvider;

    constructor(
        @inject('UsersRepository') repository: IUsersRepository,
        @inject('HashProvider') provider: IHashProvider,
    ) {
        this.usersRepository = repository;
        this.hashProvider = provider;
    }

    public async execute(data: IRequest): Promise<IResponse> {
        const user = await this.usersRepository.findByEmail(data.email);

        if (!user) {
            throw new AppError('E-mail e/ou senha incorretos.', 401);
        }

        const passwordMatched = await this.hashProvider.compareHash(
            data.password,
            user.password,
        );

        if (!passwordMatched) {
            throw new AppError('E-mail e/ou senha incorretos.', 401);
        }

        /**
         * Recupera as configurações de segurança
         */
        const { secret, expiresIn } = authConfig.jwt;

        /**
         * Gerando o token JWT
         * 1º parâmetro é o "Pay Load": São informações que podem vira ser utilizadas pelos módulos da aplicação como:
         * nome do usuário, e-mail, etc. Aqui nunca deve ser colocada a senha, pois essa informações podem ser
         * facilmente recuperadas por um interceptador.
         * 2º parâmetro é uma chave secreta: Aqui pode ser utilizada uma string gerada aleatoriamente, de forma a
         * dificultar sua identificação. Essa chave pode ser gerada no site http://www.md5.cz/ a partir de um texto
         * aleatório.
         * 3º parâmetro, configurações do token:
         * - subject: é o atributo mais importante, devendo ser definido com o id do usuário que está sendo autenticado na aplicação.
         * - expiresIn: Tempo para que o token expire. O tempo para a expiração não deve ser muito longo, porém depende bastente do tipo da aplicação.
         * É um número expressado em segundos ou uma string que define o tempo para a expiração, por exemplo:
         * - 60 = 60 segundos ou 2 minutos;
         * - '2h' = 2 horas;
         * - '1d' = 1 dia.
         */
        const token = sign({}, secret, {
            subject: user.id,
            expiresIn,
        });

        return { user, token };
    }
}

export default CreateSessionService;
