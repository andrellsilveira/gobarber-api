import { getRepository } from 'typeorm';
import { hash } from 'bcryptjs';

import User from '../models/User';

interface RequestDTO {
    name: string;
    email: string;
    password: string;
}

class CreateUserService {
    public async execute(data: RequestDTO): Promise<User> {
        const usersRepository = getRepository(User);

        const checkUserExists = await usersRepository.findOne({
            where: { email: data.email },
        });

        if (checkUserExists) {
            throw new Error('O e-mail informado já está sendo utilizado.');
        }

        /**
         * Realiza a criptografia da senha
         * O segundo parâmetro serve para a geração de um valor aleatório que será concatenado
         * à senha para fortalecer a criptografia e impedir que uma mesma sequência de caracteres
         * gere um mesmo hash, nesse caso será gerado um número de 8 dígitos
         * */
        const hashedPassword = await hash(data.password, 8);

        const user = usersRepository.create({
            name: data.name,
            email: data.email,
            password: hashedPassword,
        });

        await usersRepository.save(user);

        return user;
    }
}

export default CreateUserService;
