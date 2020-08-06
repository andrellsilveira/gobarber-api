// import { isEqual } from 'date-fns';
import { Repository, getRepository } from 'typeorm';

import IUserTokensRepository from '@modules/users/repositories/IUserTokensRepository';
import UserToken from '@modules/users/infra/typeorm/entities/UserToken';

/**
 * Ao herdar a classe "Repository" temos a disposição vários métodos para manipulação dos
 * registros do model especificado como parâmetro
 */
class UserTokensRepository implements IUserTokensRepository {
    /**
     * Cria uma variável privada do tipo repositório de uma entidade
     */
    private ormRepository: Repository<UserToken>;

    /**
     * Construtor da classa inicializado quando um objeto for criado
     */
    constructor() {
        /**
         * Inicializa a variável herdando os métodos do TypeORM através do método getRepository
         */
        this.ormRepository = getRepository(UserToken);
    }

    public async generate(user_id: string): Promise<UserToken> {
        const userToken = this.ormRepository.create({
            user_id,
        });

        await this.ormRepository.save(userToken);

        return userToken;
    }

    public async findByToken(token: string): Promise<UserToken | undefined> {
        const userToken = await this.ormRepository.findOne({
            where: { token },
        });

        return userToken;
    }
}

export default UserTokensRepository;
