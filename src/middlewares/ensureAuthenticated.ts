import { Request, Response, NextFunction } from 'express';
import { verify } from 'jsonwebtoken';

import AppError from '../errors/AppError';
import authConfig from '../config/auth';

/**
 * É necessário criar essa interface para possibilitar a recuperação dos valores retornados
 * para o token pelo cabeçalho da requisição
 */
interface TokenPayload {
    iat: number;
    exp: number;
    sub: string;
}

/**
 * Middleware para execução da autenticação do usuário
 */
export default function ensureAuthenticated(
    request: Request,
    response: Response,
    next: NextFunction,
): void {
    /**
     * Recupera o cabeçalho de autorização da requisição
     */
    const authHeader = request.headers.authorization;

    /**
     * Se não for encontrado o cabeçalho de autenticação dispara um erro
     */
    if (!authHeader) {
        throw new AppError('Token JWT não encontrado.', 401);
    }

    /**
     * Recupera o valor do token passado no cabeçalho da requisição
     * Formato do header: 'Bearer {string to token}
     */
    const [, token] = authHeader.split(' ');

    /**
     * Aqui é necessário utilizar o try/catch devido ao método "verify" disparar uma exceção e
     * para possibilitar o controle desse erro então deve-se utilizar esse bloco de instrução
     */
    try {
        /**
         * Valida se o token é valido para a aplicação, conforme a chave (secret) que foi utilizada para gerá-lo
         */
        const decode = verify(token, authConfig.jwt.secret);

        /**
         * Recupera o "subject" (sub) da autenticação realizando um cast do decode utilizando a
         * interface TokenPayload
         */
        const { sub } = decode as TokenPayload;

        /**
         * Define o id do usuário retornado pelo token para o atributo "user" criado para o
         * request da biblioteca Express
         */
        request.user = {
            id: sub,
        };

        return next();
    } catch {
        throw new AppError('Token JWT inválido', 401);
    }
}
