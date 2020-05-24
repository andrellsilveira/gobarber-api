import { getRepository } from 'typeorm';
import { compare } from 'bcryptjs';
import { sign } from 'jsonwebtoken';

import User from '../models/User';
import authConfig from '../config/auth';

interface RequestDTO {
    email: string;
    password: string;
}

interface ResponseDTO {
    user: User;
    token: string;
}

class CreateSessionService {
    public async execute(data: RequestDTO): Promise<ResponseDTO> {
        const usersRepository = getRepository(User);

        const user = await usersRepository.findOne({
            where: { email: data.email },
        });

        if (!user) {
            throw new Error('E-mail e/ou senha incorretos.');
        }

        const passwordMatched = await compare(data.password, user.password);

        if (!passwordMatched) {
            throw new Error('E-mail e/ou senha incorretos.');
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
