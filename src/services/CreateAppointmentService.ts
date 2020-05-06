import { startOfHour } from 'date-fns';

import Appointment from '../models/Appointment';
import AppointmentRepository from '../repositories/AppointmentsRepository';

interface RequestDTO {
    provider: string;
    date: Date;
}

class CreateAppointmentService {
    private appointmentsRepository: AppointmentRepository;

    constructor(appointmentsRepository: AppointmentRepository) {
        this.appointmentsRepository = appointmentsRepository;
    }

    public execute({ provider, date }: RequestDTO): Appointment {
        /**
         * Trunca a data em uma hora, zerando os minutos, segundos e milisegundos
         * */
        const appointmentDate = startOfHour(date);

        const findAppointmentInSameDate = this.appointmentsRepository.findByDate(
            appointmentDate,
        );

        /**
         * Verifica se algum objeto foi encontrado, em caso positivo retorna um erro
         */
        if (findAppointmentInSameDate) {
            throw Error('Já existe um agendamento para essa data e horário.');
        }

        const appointment = this.appointmentsRepository.create({
            provider,
            date: appointmentDate,
        });

        return appointment;
    }
}

export default CreateAppointmentService;
