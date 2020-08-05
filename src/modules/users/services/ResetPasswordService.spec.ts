import AppError from '@shared/errors/AppError';

import FakeUsersRepository from '@modules/users/repositories/fakes/FakeUsersRepository';
import FakeUserTokensRepository from '@modules/users/repositories/fakes/FakeUserTokensRepository';
import FakeHashProvider from '@modules/users/providers/HashProvider/fakes/FakeHashProvider';
import ResetPasswordService from '@modules/users/services/ResetPasswordService';

/** Define as variáveis com um escopo global */
let fakeUsersRepository: FakeUsersRepository;
let fakeUserTokensRepository: FakeUserTokensRepository;
let fakeHashProvider: FakeHashProvider;
let resetPasswordService: ResetPasswordService;

/**
 * O método "describe" serve para categorizar os testes, ou seja, identificar para qual
 * recurso da aplicação os testes serão executados, de forma que seja possível identificá-los
 * facilmente durante sua realização
 */
describe('ResetPassword', () => {
    /**
     * Gatilho disparado antes de cada um dos testes desse conjunto
     * Esse método é útil quando é necessário a inicialização de um mesmo objeto para vários
     * testes
     */
    beforeEach(() => {
        fakeUsersRepository = new FakeUsersRepository();
        fakeUserTokensRepository = new FakeUserTokensRepository();
        fakeHashProvider = new FakeHashProvider();

        resetPasswordService = new ResetPasswordService(
            fakeUsersRepository,
            fakeUserTokensRepository,
            fakeHashProvider,
        );
    });

    /**
     * O método "it" é equivalente ao método "test", porém, quando a descrição do teste é
     * inserida em inglês, sua leitura é mais intuitiva:
     * "isso deve ser capaz de fazer alguma coisa (it must be able to do something)"
     */
    it('should be able to reset the password', async () => {
        const user = await fakeUsersRepository.create({
            name: 'Ambrósio Conrado',
            email: 'ambrosio@teste.com',
            password: '123456',
        });

        const { token } = await fakeUserTokensRepository.generate(user.id);

        const generateHash = jest.spyOn(fakeHashProvider, 'generateHash');

        await resetPasswordService.execute({
            token,
            password: '123123',
        });

        const updatedUser = await fakeUsersRepository.findById(user.id);

        expect(generateHash).toBeCalledWith('123123');
        expect(updatedUser?.password).toBe('123123');
    });

    it('should not be able to reset the password with non-existing token', async () => {
        await expect(
            resetPasswordService.execute({
                token: 'token-inexistente',
                password: '123123',
            }),
        ).rejects.toBeInstanceOf(AppError);
    });

    it('should not be able to reset the password with non-existing user', async () => {
        const { token } = await fakeUserTokensRepository.generate(
            'usuario-inexistente',
        );

        await expect(
            resetPasswordService.execute({
                token,
                password: '123123',
            }),
        ).rejects.toBeInstanceOf(AppError);
    });

    it('should not be able to reset the password if passed more than 2 hours', async () => {
        const user = await fakeUsersRepository.create({
            name: 'Ambrósio Conrado',
            email: 'ambrosio@teste.com',
            password: '123456',
        });

        const { token } = await fakeUserTokensRepository.generate(user.id);

        /**
         * A função "mockImplementation" substitiu a execução ortiginal do método pela
         * implementação personalizada, ou seja, o comportamento e o retorno do método
         * "espionado" será redefinido pelo script implementado dentro do "mockImplementation"
         * Nesse caso será sobrescrito o comportamento do método "now" do objeto "Date" na sua
         * primeira execução (Once)
         */
        jest.spyOn(Date, 'now').mockImplementationOnce(() => {
            /**
             * Cria uma nova data e soma 3 horas
             */
            const customDate = new Date();
            return customDate.setHours(customDate.getHours() + 3);
        });

        await expect(
            resetPasswordService.execute({
                token,
                password: '123123',
            }),
        ).rejects.toBeInstanceOf(AppError);
    });
});
