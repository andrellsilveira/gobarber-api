import AppError from '@shared/errors/AppError';

import FakeAppointmentsRepository from '@modules/appointments/repositories/fakes/FakeAppointmentsRepository';
import CreateAppointmentService from '@modules/appointments/services/CreateAppointmentService';

/**
 * O método "describe" serve para categorizar os testes, ou seja, identificar para qual
 * recurso da aplicação os testes serão executados, de forma que seja possível identificá-los
 * facilmente durante sua realização
 */
describe('CreateAppointment', () => {
    /**
     * O método "it" é equivalente ao método "test", porém, quando a descrição do teste é
     * inserida em inglês, sua leitura é mais intuitiva:
     * "isso deve ser capaz de fazer alguma coisa (it must be able to do something)"
     */
    it('should be able to create a new appointment', async () => {
        const fakeAppointmentsRepository = new FakeAppointmentsRepository();
        const createAppointmentService = new CreateAppointmentService(
            fakeAppointmentsRepository,
        );

        const appointment = await createAppointmentService.execute({
            date: new Date(),
            provider_id: '1234567890',
        });

        expect(appointment).toHaveProperty('id');
        expect(appointment.provider_id).toBe('1234567890');
    });

    it('should not be able to create two appointments on the same time on a same date', async () => {
        const fakeAppointmentsRepository = new FakeAppointmentsRepository();
        const createAppointmentService = new CreateAppointmentService(
            fakeAppointmentsRepository,
        );

        const appointmentDate = new Date(2020, 4, 10, 11);

        await createAppointmentService.execute({
            date: appointmentDate,
            provider_id: '1234567890',
        });

        /**
         * O teste abaixo será interpretado da seguinte forma:
         * "espera-se que o resultado da criação seja de rejeição, ou seja, que ocorra um erro,
         * e a instância retornada seja um 'AppError'"
         */
        expect(
            createAppointmentService.execute({
                date: appointmentDate,
                provider_id: '1234567890',
            }),
        ).rejects.toBeInstanceOf(AppError);
    });
});
