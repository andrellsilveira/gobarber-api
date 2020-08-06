import AppError from '@shared/errors/AppError';

import FakeUsersRepository from '@modules/users/repositories/fakes/FakeUsersRepository';
import ListProvidersService from '@modules/appointments/services/ListProvidersService';

let fakeUsersRepository: FakeUsersRepository;
let listProvidersServices: ListProvidersService;

/**
 * O método "describe" serve para categorizar os testes, ou seja, identificar para qual
 * recurso da aplicação os testes serão executados, de forma que seja possível identificá-los
 * facilmente durante sua realização
 */
describe('ListProviders', () => {
    /**
     * Gatilho disparado antes de cada um dos testes desse conjunto
     * Esse método é útil quando é necessário a inicialização de um mesmo objeto para vários
     * testes
     */
    beforeEach(() => {
        fakeUsersRepository = new FakeUsersRepository();
        listProvidersServices = new ListProvidersService(fakeUsersRepository);
    });

    /**
     * O método "it" é equivalente ao método "test", porém, quando a descrição do teste é
     * inserida em inglês, sua leitura é mais intuitiva:
     * "isso deve ser capaz de fazer alguma coisa (it must be able to do something)"
     */
    it('should be able to list the providers', async () => {
        const user1 = await fakeUsersRepository.create({
            name: 'Ambrósio Conrado',
            email: 'ambrosio@teste.com',
            password: '123456',
        });

        const user2 = await fakeUsersRepository.create({
            name: 'Fulano de Tal',
            email: 'fulano@teste.com',
            password: '111111',
        });

        const loggedUser = await fakeUsersRepository.create({
            name: 'Cicrana Beltrana',
            email: 'cicrana@teste.com',
            password: '222222',
        });

        const providers = await listProvidersServices.execute({
            userId: loggedUser.id,
        });

        expect(providers).toEqual([user1, user2]);
    });
});
