import FakeAppointmentsRepository from '@modules/appointments/repositories/fakes/FakeAppointmentsRepository';
import ListProviderAppointmentsService from '@modules/appointments/services/ListProviderAppointmentsService';

let fakeAppointmentsRepository: FakeAppointmentsRepository;
let listProviderAppointmentsService: ListProviderAppointmentsService;

/**
 * O método "describe" serve para categorizar os testes, ou seja, identificar para qual
 * recurso da aplicação os testes serão executados, de forma que seja possível identificá-los
 * facilmente durante sua realização
 */
describe('ListProviderAppointments', () => {
    /**
     * Gatilho disparado antes de cada um dos testes desse conjunto
     * Esse método é útil quando é necessário a inicialização de um mesmo objeto para vários
     * testes
     */
    beforeEach(() => {
        fakeAppointmentsRepository = new FakeAppointmentsRepository();
        listProviderAppointmentsService = new ListProviderAppointmentsService(
            fakeAppointmentsRepository,
        );
    });

    /**
     * O método "it" é equivalente ao método "test", porém, quando a descrição do teste é
     * inserida em inglês, sua leitura é mais intuitiva:
     * "isso deve ser capaz de fazer alguma coisa (it must be able to do something)"
     */
    it('should be able to list the provider appointments on a specific day', async () => {
        const appointment1 = await fakeAppointmentsRepository.create({
            provider_id: '123456',
            user_id: '654321',
            /**
             * Cria uma nova data para 20/05/2020 às 08:00:00
             * A contagem dos meses para o objeto "Date" inicia em 0 (zero)
             */
            date: new Date(2020, 4, 20, 8, 0, 0),
        });

        const appointment2 = await fakeAppointmentsRepository.create({
            provider_id: '123456',
            user_id: '654321',
            date: new Date(2020, 4, 20, 9, 0, 0),
        });

        const appointments = await listProviderAppointmentsService.execute({
            provider_id: '123456',
            day: 20,
            month: 5,
            year: 2020,
        });

        /**
         * Verifica se o retorno é um array contendo os valores definidos para o teste
         */
        expect(appointments).toEqual([appointment1, appointment2]);
    });
});
