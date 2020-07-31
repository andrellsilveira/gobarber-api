import { hash, compare } from 'bcryptjs';

import IHashProvider from '@modules/users/providers/HashProvider/models/IHashProvider';

class BCryptHashProvider implements IHashProvider {
    public async generateHash(payload: string): Promise<string> {
        /**
         * Realiza a criptografia da senha
         * O segundo parâmetro serve para a geração de um valor aleatório que será concatenado
         * à senha para fortalecer a criptografia e impedir que uma mesma sequência de caracteres
         * gere um mesmo hash, nesse caso será gerado um número de 8 dígitos
         */
        return hash(payload, 8);
    }

    public async compareHash(
        payload: string,
        hashed: string,
    ): Promise<boolean> {
        return compare(payload, hashed);
    }
}

export default BCryptHashProvider;
