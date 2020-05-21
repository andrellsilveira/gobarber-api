import { getRepository } from 'typeorm';
import { compare } from 'bcryptjs';
import { sign } from 'jsonwebtoken';

import User from '../models/User';

interface RequestDTO {
    email: string;
    password: string;
}

interface ResponseDTO {
    user: User;
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

        return { user };
    }
}

export default CreateSessionService;
