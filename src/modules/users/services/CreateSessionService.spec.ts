import AppError from '@shared/errors/AppError';

import FakeUsersRepository from '@modules/users/repositories/fakes/FakeUsersRepository';
import FakeHashProvider from '@modules/users/providers/HashProvider/fakes/FakeHashProvider';
import CreateSessionService from '@modules/users/services/CreateSessionService';
import CreateUserService from '@modules/users/services/CreateUserService';

/**
 * O método "describe" serve para categorizar os testes, ou seja, identificar para qual
 * recurso da aplicação os testes serão executados, de forma que seja possível identificá-los
 * facilmente durante sua realização
 */
describe('CreateSession', () => {
    /**
     * O método "it" é equivalente ao método "test", porém, quando a descrição do teste é
     * inserida em inglês, sua leitura é mais intuitiva:
     * "isso deve ser capaz de fazer alguma coisa (it must be able to do something)"
     */
    it('should be able to create a new session', async () => {
        const fakeUsersRepository = new FakeUsersRepository();
        const fakeHashProvider = new FakeHashProvider();

        const createUserService = new CreateUserService(
            fakeUsersRepository,
            fakeHashProvider,
        );

        const user = await createUserService.execute({
            name: 'Ambrósio Conrado',
            email: 'ambrosio@teste.com',
            password: '123456',
        });

        const createSessionService = new CreateSessionService(
            fakeUsersRepository,
            fakeHashProvider,
        );

        const response = await createSessionService.execute({
            email: 'ambrosio@teste.com',
            password: '123456',
        });

        expect(response).toHaveProperty('token');
        expect(response.user).toEqual(user);
    });

    it('should not be able to create session with non existing user', async () => {
        const fakeUsersRepository = new FakeUsersRepository();
        const fakeHashProvider = new FakeHashProvider();

        const createSessionService = new CreateSessionService(
            fakeUsersRepository,
            fakeHashProvider,
        );

        await expect(
            createSessionService.execute({
                email: 'ambrosio@teste.com',
                password: '123456',
            }),
        ).rejects.toBeInstanceOf(AppError);
    });

    it('should not be able to create session with a wrong password', async () => {
        const fakeUsersRepository = new FakeUsersRepository();
        const fakeHashProvider = new FakeHashProvider();

        const createUserService = new CreateUserService(
            fakeUsersRepository,
            fakeHashProvider,
        );

        await createUserService.execute({
            name: 'Ambrósio Conrado',
            email: 'ambrosio@teste.com',
            password: '123456',
        });

        const createSessionService = new CreateSessionService(
            fakeUsersRepository,
            fakeHashProvider,
        );

        await expect(
            createSessionService.execute({
                email: 'ambrosio@teste.com',
                password: '12345',
            }),
        ).rejects.toBeInstanceOf(AppError);
    });
});
