import AppError from '@shared/errors/AppError';

import FakeUsersRepository from '@modules/users/repositories/fakes/FakeUsersRepository';
import FakeHashProvider from '@modules/users/providers/HashProvider/fakes/FakeHashProvider';
import UpdateProfileService from '@modules/users/services/UpdateProfileService';

let fakeUsersRepository: FakeUsersRepository;
let fakeHashProvider: FakeHashProvider;
let updateProfileService: UpdateProfileService;

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
        fakeHashProvider = new FakeHashProvider();

        updateProfileService = new UpdateProfileService(
            fakeUsersRepository,
            fakeHashProvider,
        );
    });

    /**
     * O método "it" é equivalente ao método "test", porém, quando a descrição do teste é
     * inserida em inglês, sua leitura é mais intuitiva:
     * "isso deve ser capaz de fazer alguma coisa (it must be able to do something)"
     */
    it('should be able to update user profile', async () => {
        const user = await fakeUsersRepository.create({
            name: 'Ambrósio Conrado',
            email: 'ambrosio@teste.com',
            password: '123456',
        });

        const updatedUser = await updateProfileService.execute({
            userId: user.id,
            name: 'Ambrósio Conrado I',
            email: 'ambrosio1@teste.com',
        });

        expect(updatedUser.name).toBe('Ambrósio Conrado I');
        expect(updatedUser.email).toBe('ambrosio1@teste.com');
    });

    it('should not be able to change e-mail to another user e-mail', async () => {
        const user = await fakeUsersRepository.create({
            name: 'Ambrósio Conrado',
            email: 'ambrosio@teste.com',
            password: '123456',
        });

        await fakeUsersRepository.create({
            name: 'Fulano de Tal',
            email: 'fulano@teste.com',
            password: '987654',
        });

        await expect(
            updateProfileService.execute({
                userId: user.id,
                name: 'Ambrósio Conrado',
                email: 'fulano@teste.com',
            }),
        ).rejects.toBeInstanceOf(AppError);
    });

    it('should be able to update the password', async () => {
        const user = await fakeUsersRepository.create({
            name: 'Ambrósio Conrado',
            email: 'ambrosio@teste.com',
            password: '123456',
        });

        const updatedUser = await updateProfileService.execute({
            userId: user.id,
            name: 'Ambrósio Conrado I',
            email: 'ambrosio1@teste.com',
            oldPassword: '123456',
            password: '123123',
        });

        expect(updatedUser.password).toBe('123123');
    });

    it('should not be able to update the password without the old one', async () => {
        const user = await fakeUsersRepository.create({
            name: 'Ambrósio Conrado',
            email: 'ambrosio@teste.com',
            password: '123456',
        });

        await expect(
            updateProfileService.execute({
                userId: user.id,
                name: 'Ambrósio Conrado I',
                email: 'ambrosio1@teste.com',
                password: '123123',
            }),
        ).rejects.toBeInstanceOf(AppError);
    });

    it('should not be able to update the password with wrong the old one', async () => {
        const user = await fakeUsersRepository.create({
            name: 'Ambrósio Conrado',
            email: 'ambrosio@teste.com',
            password: '123456',
        });

        await expect(
            updateProfileService.execute({
                userId: user.id,
                name: 'Ambrósio Conrado I',
                email: 'ambrosio1@teste.com',
                oldPassword: '123123',
                password: '123123',
            }),
        ).rejects.toBeInstanceOf(AppError);
    });

    it('should not be able to update profile if user do not exists', async () => {
        await expect(
            updateProfileService.execute({
                userId: 'id-nao-existente',
                name: 'Ambrósio Conrado I',
                email: 'ambrosio1@teste.com',
            }),
        ).rejects.toBeInstanceOf(AppError);
    });
});
