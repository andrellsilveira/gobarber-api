import { Request, Response, NextFunction } from 'express';
import { RateLimiterRedis } from 'rate-limiter-flexible';
import redis from 'redis';
import AppError from '@shared/errors/AppError';

/**
 * Cria a conexão com o Redis
 */
const redisClient = redis.createClient({
    host: process.env.REDIS_HOST,
    port: Number(process.env.REDIS_PORT),
    password: process.env.REDIS_PASS || undefined,
});

/**
 * Cria o limitador de acesso
 */
const limiter = new RateLimiterRedis({
    storeClient: redisClient,
    keyPrefix: 'rateLimit',
    /** Quantidade de requisitções permitidas por IP em determinado limite de tempo (duration) */
    points: 5,
    /** Duração da requisição por IP (em segundos) */
    duration: 1,
});

export default async function rateLimiter(
    request: Request,
    response: Response,
    next: NextFunction,
): Promise<void> {
    try {
        /** Executa o limitador para o endereço IP que está realizando a requisição */
        await limiter.consume(request.ip);

        return next();
    } catch (err) {
        throw new AppError('Muitas requisições realizadas.', 429);
    }
}
