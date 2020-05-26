import { Request, Response, NextFunction } from 'express';

import AppError from '../errors/AppError';
/**
 * Middleware para tratamento e exibição das mensagens de erro da aplicação.
 * Os middlewares para tratamento de erros devem receber 4 parâmetros.
 */
export default function handlerErrors(
    err: Error,
    request: Request,
    response: Response,
    next: NextFunction,
): Response {
    /**
     * Verifica se o erro disparado pela aplicação é uma instância da classe AppError
     */
    if (err instanceof AppError) {
        return response.status(err.statusCode).json({
            status: 'error',
            message: err.message,
        });
    }

    return response.status(500).json({
        status: 'error',
        message: 'Erro interno do servidor',
    });
}
