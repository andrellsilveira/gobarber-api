import AppError from '@shared/errors/AppError';

import FakeUsersRepository from '@modules/users/repositories/fakes/FakeUsersRepository';
import FakeStorageProvider from '@shared/container/providers/StorageProvider/fakes/FakeStorageProvider';
import UpdateUserAvatarService from '@modules/users/services/UpdateUserAvatarService';

/**
 * O método "describe" serve para categorizar os testes, ou seja, identificar para qual
 * recurso da aplicação os testes serão executados, de forma que seja possível identificá-los
 * facilmente durante sua realização
 */
describe('UpdateUserAvatar', () => {
    /**
     * O método "it" é equivalente ao método "test", porém, quando a descrição do teste é
     * inserida em inglês, sua leitura é mais intuitiva:
     * "isso deve ser capaz de fazer alguma coisa (it must be able to do something)"
     */
    it('should be able to update user avatar', async () => {
        const fakeUsersRepository = new FakeUsersRepository();
        const fakeStorageProvider = new FakeStorageProvider();

        const user = await fakeUsersRepository.create({
            name: 'Ambrósio Conrado',
            email: 'ambrosio@teste.com',
            password: '123456',
        });

        const updateUserAvatarService = new UpdateUserAvatarService(
            fakeUsersRepository,
            fakeStorageProvider,
        );

        await updateUserAvatarService.execute({
            userId: user.id,
            avatarFileName: 'avatar.jpg',
        });

        expect(user.avatar).toBe('avatar.jpg');
    });

    it('should not be able to update avatar if user not exists', async () => {
        const fakeUsersRepository = new FakeUsersRepository();
        const fakeStorageProvider = new FakeStorageProvider();

        const updateUserAvatarService = new UpdateUserAvatarService(
            fakeUsersRepository,
            fakeStorageProvider,
        );

        await expect(
            updateUserAvatarService.execute({
                userId: '0123456789',
                avatarFileName: 'avatar.jpg',
            }),
        ).rejects.toBeInstanceOf(AppError);
    });

    it('should delete old avatar when updating new one', async () => {
        const fakeUsersRepository = new FakeUsersRepository();
        const fakeStorageProvider = new FakeStorageProvider();

        /**
         * Verifica se um método de um recurso que está sendo testado foi disparado
         */
        const deleteFile = jest.spyOn(fakeStorageProvider, 'deleteFile');

        const user = await fakeUsersRepository.create({
            name: 'Ambrósio Conrado',
            email: 'ambrosio@teste.com',
            password: '123456',
        });

        const updateUserAvatarService = new UpdateUserAvatarService(
            fakeUsersRepository,
            fakeStorageProvider,
        );

        await updateUserAvatarService.execute({
            userId: user.id,
            avatarFileName: 'avatar.jpg',
        });

        await updateUserAvatarService.execute({
            userId: user.id,
            avatarFileName: 'avatar2.jpg',
        });

        /**
         * Lê-se: "Espera-se que a função 'deleteFile' tenha sido executada com o parâmetro
         * 'avatar.jpg'"
         */
        expect(deleteFile).toHaveBeenCalledWith('avatar.jpg');

        expect(user.avatar).toBe('avatar2.jpg');
    });
});
