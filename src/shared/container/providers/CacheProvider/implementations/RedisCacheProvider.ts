import Redis, { Redis as RedisClient } from 'ioredis';
import cacheConfig from '@config/cache';

import ICacheProvider from '@shared/container/providers/CacheProvider/models/ICacheProvider';

class RedisCacheProvider implements ICacheProvider {
    private client: RedisClient;

    constructor() {
        this.client = new Redis(cacheConfig.config.redis);
    }

    public async save(key: string, value: any): Promise<void> {
        await this.client.set(key, JSON.stringify(value));
    }

    public async recover<T>(key: string): Promise<T | undefined> {
        const data = await this.client.get(key);

        if (!data) {
            return undefined;
        }

        /**
         * Converte o JSON para um objeto "T" (desconhecido)
         */
        const parsedData = JSON.parse(data) as T;

        return parsedData;
    }

    public async invalidate(key: string): Promise<void> {
        /** Exclui a entrada de cache */
        await this.client.del(key);
    }

    public async invalidatePrefix(prefix: string): Promise<void> {
        /**
         * Recupera todas as chaves que contenham o prefixo informado seguido de : e qualquer
         * outra informação
         */
        const keys = await this.client.keys(`${prefix}:*`);

        /**
         * Cria um pipeline (batch) para exclusão dos registros
         */
        const pipeline = this.client.pipeline();

        /**
         * Cria a execução da exclusão dos registros
         */
        keys.forEach(key => {
            pipeline.del(key);
        });

        /**
         * Executa a pipeline
         */
        await pipeline.exec();
    }
}

export default RedisCacheProvider;
