import AppError from '@shared/errors/AppError';

import FakeUsersRepository from '@modules/users/repositories/fakes/FakeUsersRepository';
import ShowProfileService from '@modules/users/services/ShowProfileService';

let fakeUsersRepository: FakeUsersRepository;
let showProfileService: ShowProfileService;

/**
 * O método "describe" serve para categorizar os testes, ou seja, identificar para qual
 * recurso da aplicação os testes serão executados, de forma que seja possível identificá-los
 * facilmente durante sua realização
 */
describe('UpdateProfile', () => {
    /**
     * Gatilho disparado antes de cada um dos testes desse conjunto
     * Esse método é útil quando é necessário a inicialização de um mesmo objeto para vários
     * testes
     */
    beforeEach(() => {
        fakeUsersRepository = new FakeUsersRepository();
        showProfileService = new ShowProfileService(fakeUsersRepository);
    });

    /**
     * O método "it" é equivalente ao método "test", porém, quando a descrição do teste é
     * inserida em inglês, sua leitura é mais intuitiva:
     * "isso deve ser capaz de fazer alguma coisa (it must be able to do something)"
     */
    it('should be able to show the profile', async () => {
        const user = await fakeUsersRepository.create({
            name: 'Ambrósio Conrado',
            email: 'ambrosio@teste.com',
            password: '123456',
        });

        const profile = await showProfileService.execute({
            userId: user.id,
        });

        expect(profile.name).toBe('Ambrósio Conrado');
        expect(profile.email).toBe('ambrosio@teste.com');
    });

    it('should not be able to show profile if user do not exists', async () => {
        await expect(
            showProfileService.execute({
                userId: 'id-nao-existente',
            }),
        ).rejects.toBeInstanceOf(AppError);
    });
});
