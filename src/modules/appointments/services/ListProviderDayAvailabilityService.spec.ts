import FakeAppointmentsRepository from '@modules/appointments/repositories/fakes/FakeAppointmentsRepository';
import ListProviderDayAvailabilityService from '@modules/appointments/services/ListProviderDayAvailabilityService';

let fakeAppointmentsRepository: FakeAppointmentsRepository;
let listProviderDayAvailabilityService: ListProviderDayAvailabilityService;

/**
 * O método "describe" serve para categorizar os testes, ou seja, identificar para qual
 * recurso da aplicação os testes serão executados, de forma que seja possível identificá-los
 * facilmente durante sua realização
 */
describe('ListProviderDayAvailability', () => {
    /**
     * Gatilho disparado antes de cada um dos testes desse conjunto
     * Esse método é útil quando é necessário a inicialização de um mesmo objeto para vários
     * testes
     */
    beforeEach(() => {
        fakeAppointmentsRepository = new FakeAppointmentsRepository();
        listProviderDayAvailabilityService = new ListProviderDayAvailabilityService(
            fakeAppointmentsRepository,
        );
    });

    /**
     * O método "it" é equivalente ao método "test", porém, quando a descrição do teste é
     * inserida em inglês, sua leitura é mais intuitiva:
     * "isso deve ser capaz de fazer alguma coisa (it must be able to do something)"
     */
    it('should be able to list the the day availability from provider', async () => {
        await fakeAppointmentsRepository.create({
            provider_id: '123456',
            user_id: '654321',
            /**
             * Cria uma nova data para 20/05/2020 às 08:00:00
             * A contagem dos meses para o objeto "Date" inicia em 0 (zero)
             */
            date: new Date(2020, 4, 20, 14, 0, 0),
        });

        await fakeAppointmentsRepository.create({
            provider_id: '123456',
            user_id: '654321',
            date: new Date(2020, 4, 20, 15, 0, 0),
        });

        /**
         * A função "mockImplementation" substitiu a execução original do método pela
         * implementação personalizada, ou seja, o comportamento e o retorno do método
         * "espionado" será redefinido pelo script implementado dentro do "mockImplementation"
         * Nesse caso será sobrescrito o comportamento do método "now" do objeto "Date" na sua
         * primeira execução (Once)
         */
        jest.spyOn(Date, 'now').mockImplementationOnce(() => {
            return new Date(2020, 4, 20, 11, 0, 0).getTime();
        });

        const availability = await listProviderDayAvailabilityService.execute({
            provider_id: '123456',
            year: 2020,
            month: 5,
            day: 20,
        });

        /**
         * Verifica se o retorno é um array contendo os valores definidos para o teste
         */
        expect(availability).toEqual(
            expect.arrayContaining([
                { hour: 8, available: false },
                { hour: 9, available: false },
                { hour: 10, available: false },
                { hour: 13, available: true },
                { hour: 14, available: false },
                { hour: 15, available: false },
                { hour: 16, available: true },
            ]),
        );
    });
});
