import AppError from '@shared/errors/AppError';

import FakeAppointmentsRepository from '@modules/appointments/repositories/fakes/FakeAppointmentsRepository';
import FakeNotificationsRepository from '@modules/notifications/repositories/fakes/FakeNotificationsRepository';
import CreateAppointmentService from '@modules/appointments/services/CreateAppointmentService';

let fakeAppointmentsRepository: FakeAppointmentsRepository;
let fakeNotificationsRepository: FakeNotificationsRepository;
let createAppointmentService: CreateAppointmentService;

/**
 * O método "describe" serve para categorizar os testes, ou seja, identificar para qual
 * recurso da aplicação os testes serão executados, de forma que seja possível identificá-los
 * facilmente durante sua realização
 */
describe('CreateAppointment', () => {
    /**
     * Gatilho disparado antes de cada um dos testes desse conjunto
     * Esse método é útil quando é necessário a inicialização de um mesmo objeto para vários
     * testes
     */
    beforeEach(() => {
        fakeAppointmentsRepository = new FakeAppointmentsRepository();
        fakeNotificationsRepository = new FakeNotificationsRepository();
        createAppointmentService = new CreateAppointmentService(
            fakeAppointmentsRepository,
            fakeNotificationsRepository,
        );
    });

    /**
     * O método "it" é equivalente ao método "test", porém, quando a descrição do teste é
     * inserida em inglês, sua leitura é mais intuitiva:
     * "isso deve ser capaz de fazer alguma coisa (it must be able to do something)"
     */
    it('should be able to create a new appointment', async () => {
        jest.spyOn(Date, 'now').mockImplementationOnce(() => {
            return new Date(2020, 4, 10, 12, 0, 0).getTime();
        });

        const appointment = await createAppointmentService.execute({
            date: new Date(2020, 4, 10, 13, 0, 0),
            user_id: '9876543210',
            provider_id: '1234567890',
        });

        expect(appointment).toHaveProperty('id');
        expect(appointment.provider_id).toBe('1234567890');
    });

    it('should not be able to create two appointments on the same time on a same date', async () => {
        jest.spyOn(Date, 'now').mockImplementationOnce(() => {
            return new Date(2020, 4, 10, 12, 0, 0).getTime();
        });

        const appointmentDate = new Date(2020, 4, 10, 13, 0, 0);

        await createAppointmentService.execute({
            date: appointmentDate,
            user_id: '9876543210',
            provider_id: '1234567890',
        });

        /**
         * O teste abaixo será interpretado da seguinte forma:
         * "espera-se que o resultado da criação seja de rejeição, ou seja, que ocorra um erro,
         * e a instância retornada seja um 'AppError'"
         */
        await expect(
            createAppointmentService.execute({
                date: appointmentDate,
                user_id: '9876543210',
                provider_id: '1234567890',
            }),
        ).rejects.toBeInstanceOf(AppError);
    });

    it('should not be able to create an appointment on a past date', async () => {
        const appointmentDate = new Date(2020, 4, 10, 11);

        jest.spyOn(Date, 'now').mockImplementationOnce(() => {
            return new Date(2020, 4, 10, 12, 0, 0).getTime();
        });

        await expect(
            createAppointmentService.execute({
                date: appointmentDate,
                user_id: '9876543210',
                provider_id: '1234567890',
            }),
        ).rejects.toBeInstanceOf(AppError);
    });

    it('should not be able to create an appointment with same user as provider', async () => {
        const appointmentDate = new Date(2020, 4, 10, 13);

        jest.spyOn(Date, 'now').mockImplementationOnce(() => {
            return new Date(2020, 4, 10, 12, 0, 0).getTime();
        });

        await expect(
            createAppointmentService.execute({
                date: appointmentDate,
                user_id: '1234567890',
                provider_id: '1234567890',
            }),
        ).rejects.toBeInstanceOf(AppError);
    });

    it('should not be able to create an appointment before 8am or after 5pm', async () => {
        jest.spyOn(Date, 'now').mockImplementationOnce(() => {
            return new Date(2020, 4, 10, 6, 0, 0).getTime();
        });

        await expect(
            createAppointmentService.execute({
                date: new Date(2020, 4, 10, 7),
                user_id: '9876543210',
                provider_id: '1234567890',
            }),
        ).rejects.toBeInstanceOf(AppError);

        await expect(
            createAppointmentService.execute({
                date: new Date(2020, 4, 10, 18),
                user_id: '9876543210',
                provider_id: '1234567890',
            }),
        ).rejects.toBeInstanceOf(AppError);
    });
});
