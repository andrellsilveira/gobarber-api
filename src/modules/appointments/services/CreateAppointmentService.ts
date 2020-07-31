import { startOfHour } from 'date-fns';
import { injectable, inject } from 'tsyringe';

import AppError from '@shared/errors/AppError';
import Appointment from '@modules/appointments/infra/typeorm/entities/Appointment';
import IAppointmentsRepository from '@modules/appointments/repositories/IAppointmentsRepository';

interface IRequest {
    provider_id: string;
    date: Date;
}

@injectable()
class CreateAppointmentService {
    private appointmentsRepository: IAppointmentsRepository;

    constructor(
        @inject('AppointmentsRepository') repository: IAppointmentsRepository,
    ) {
        this.appointmentsRepository = repository;
    }

    public async execute({
        provider_id,
        date,
    }: IRequest): Promise<Appointment> {
        /**
         * Trunca a data em uma hora, zerando os minutos, segundos e milisegundos
         * */
        const appointmentDate = startOfHour(date);

        const findAppointmentInSameDate = await this.appointmentsRepository.findByDate(
            appointmentDate,
        );

        /**
         * Verifica se algum objeto foi encontrado, em caso positivo retorna um erro
         */
        if (findAppointmentInSameDate) {
            throw new AppError(
                'Já existe um agendamento para essa data e horário.',
            );
        }

        /**
         * O método "create" apenas cria uma instância do registro e não o salva no banco de
         * dados. Para salvar é necessário utilizar o método "save"
         */
        const appointment = this.appointmentsRepository.create({
            provider_id,
            date: appointmentDate,
        });

        return appointment;
    }
}

export default CreateAppointmentService;
