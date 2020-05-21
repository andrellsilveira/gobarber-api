import { startOfHour } from 'date-fns';
import { getCustomRepository } from 'typeorm';

import Appointment from '../models/Appointment';
import AppointmentRepository from '../repositories/AppointmentsRepository';

interface RequestDTO {
    provider_id: string;
    date: Date;
}

class CreateAppointmentService {
    public async execute({
        provider_id,
        date,
    }: RequestDTO): Promise<Appointment> {
        /**
         * Recupera o repositório e iniciliza-o na variável
         */
        const appointmentsRepository = getCustomRepository(
            AppointmentRepository,
        );
        /**
         * Trunca a data em uma hora, zerando os minutos, segundos e milisegundos
         * */
        const appointmentDate = startOfHour(date);

        const findAppointmentInSameDate = await appointmentsRepository.findByDate(
            appointmentDate,
        );

        /**
         * Verifica se algum objeto foi encontrado, em caso positivo retorna um erro
         */
        if (findAppointmentInSameDate) {
            throw Error('Já existe um agendamento para essa data e horário.');
        }

        /**
         * O método "create" apenas cria uma instância do registro e não o salva no banco de
         * dados. Para salvar é necessário utilizar o método "save"
         */
        const appointment = appointmentsRepository.create({
            provider_id,
            date: appointmentDate,
        });

        /**
         * Método utilizado para gravar o registro no banco de dados
         */
        await appointmentsRepository.save(appointment);

        return appointment;
    }
}

export default CreateAppointmentService;
