import AppError from '@shared/errors/AppError';

import FakeUsersRepository from '@modules/users/repositories/fakes/FakeUsersRepository';
import FakeHashProvider from '@modules/users/providers/HashProvider/fakes/FakeHashProvider';
import FakeCacheProvider from '@shared/container/providers/CacheProvider/fakes/FakeCacheProvider';
import CreateUserService from '@modules/users/services/CreateUserService';

let fakeUsersRepository: FakeUsersRepository;
let fakeHashProvider: FakeHashProvider;
let fakeCacheProvider: FakeCacheProvider;
let createUserService: CreateUserService;

/**
 * O método "describe" serve para categorizar os testes, ou seja, identificar para qual
 * recurso da aplicação os testes serão executados, de forma que seja possível identificá-los
 * facilmente durante sua realização
 */
describe('CreateUser', () => {
    /**
     * Gatilho disparado antes de cada um dos testes desse conjunto
     * Esse método é útil quando é necessário a inicialização de um mesmo objeto para vários
     * testes
     */
    beforeEach(() => {
        fakeUsersRepository = new FakeUsersRepository();
        fakeHashProvider = new FakeHashProvider();
        fakeCacheProvider = new FakeCacheProvider();

        createUserService = new CreateUserService(
            fakeUsersRepository,
            fakeHashProvider,
            fakeCacheProvider,
        );
    });

    /**
     * O método "it" é equivalente ao método "test", porém, quando a descrição do teste é
     * inserida em inglês, sua leitura é mais intuitiva:
     * "isso deve ser capaz de fazer alguma coisa (it must be able to do something)"
     */
    it('should be able to create a new user', async () => {
        const user = await createUserService.execute({
            name: 'Ambrósio Conrado',
            email: 'ambrosio@teste.com',
            password: '123456',
        });

        expect(user).toHaveProperty('id');
    });

    it('should not be able to create two users with the same e-mail', async () => {
        await createUserService.execute({
            name: 'Ambrósio Conrado',
            email: 'conrado@teste.com',
            password: '123456',
        });

        /**
         * O teste abaixo será interpretado da seguinte forma:
         * "espera-se que o resultado da criação seja de rejeição, ou seja, que ocorra um erro,
         * e a instância retornada seja um 'AppError'"
         */
        await expect(
            createUserService.execute({
                name: 'Gebedaia Conrado',
                email: 'conrado@teste.com',
                password: '123456',
            }),
        ).rejects.toBeInstanceOf(AppError);
    });
});
