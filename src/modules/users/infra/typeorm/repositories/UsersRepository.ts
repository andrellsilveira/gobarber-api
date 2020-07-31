// import { isEqual } from 'date-fns';
import { Repository, getRepository } from 'typeorm';

import IUsersRepository from '@modules/users/repositories/IUsersRepository';
import ICreateUserDTO from '@modules/users/dtos/ICreateUserDTO';
import User from '@modules/users/infra/typeorm/entities/User';

/**
 * Ao herdar a classe "Repository" temos a disposição vários métodos para manipulação dos
 * registros do model especificado como parâmetro
 */
class UsersRepository implements IUsersRepository {
    /**
     * Cria uma variável privada do tipo repositório de uma entidade
     */
    private ormRepository: Repository<User>;

    /**
     * Construtor da classa inicializado quando um objeto for criado
     */
    constructor() {
        /**
         * Inicializa a variável herdando os métodos do TypeORM através do método getRepository
         */
        this.ormRepository = getRepository(User);
    }

    public async findById(id: string): Promise<User | undefined> {
        const user = await this.ormRepository.findOne(id);

        return user;
    }

    public async findByEmail(email: string): Promise<User | undefined> {
        const user = await this.ormRepository.findOne({
            where: { email },
        });

        return user;
    }

    /**
     * Sobrescreve o método "create" do TypeORM
     * @param ICreateUserDTO
     */
    public async create(userData: ICreateUserDTO): Promise<User> {
        /**
         * O método "create" apenas cria uma instância do registro e não o salva no banco de
         * dados. Para salvar é necessário utilizar o método "save"
         */
        const user = this.ormRepository.create(userData);

        /**
         * Método utilizado para gravar o registro no banco de dados
         */
        await this.ormRepository.save(user);

        return user;
    }

    /**
     * Sobrescreve o método "save" do TypeORM
     * @param user
     */
    public async save(user: User): Promise<User> {
        return this.ormRepository.save(user);
    }
}

export default UsersRepository;
