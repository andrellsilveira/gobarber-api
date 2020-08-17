import { startOfHour, isBefore, getHours, format } from 'date-fns';
import { injectable, inject } from 'tsyringe';

import AppError from '@shared/errors/AppError';
import Appointment from '@modules/appointments/infra/typeorm/entities/Appointment';
import IAppointmentsRepository from '@modules/appointments/repositories/IAppointmentsRepository';
import INotificationsRepository from '@modules/notifications/repositories/INotificationsRepository';
import ICacheProvider from '@shared/container/providers/CacheProvider/models/ICacheProvider';

interface IRequest {
    provider_id: string;
    user_id: string;
    date: Date;
}

@injectable()
class CreateAppointmentService {
    private appointmentsRepository: IAppointmentsRepository;

    private notificationsRepository: INotificationsRepository;

    private cacheProvider: ICacheProvider;

    constructor(
        @inject('AppointmentsRepository')
        repositoryAppointments: IAppointmentsRepository,
        @inject('NotificationsRepository')
        repositoryNotifications: INotificationsRepository,
        @inject('CacheProvider') cache: ICacheProvider,
    ) {
        this.appointmentsRepository = repositoryAppointments;
        this.notificationsRepository = repositoryNotifications;
        this.cacheProvider = cache;
    }

    public async execute({
        provider_id,
        user_id,
        date,
    }: IRequest): Promise<Appointment> {
        /**
         * Trunca a data em uma hora, zerando os minutos, segundos e milisegundos
         * */
        const appointmentDate = startOfHour(date);

        /**
         * Valida se o horário do agendamento é maior que a data corrente
         */
        if (isBefore(appointmentDate, Date.now())) {
            throw new AppError(
                'Não é possível realizar um agendamento em um horário que já passou.',
            );
        }

        /** Valida que o usuário não pode realizar um agendamento com ele mesmo */
        if (user_id === provider_id) {
            throw new AppError(
                'Não é possível realizar um agendamento consigo mesmo.',
            );
        }

        /** Valida que um agendamento só pode ser realizado entre 8 e 17 horas */
        const appointmentHour = getHours(appointmentDate);

        if (appointmentHour < 8 || appointmentHour > 17) {
            throw new AppError(
                'Só é possível realizar um agendamento entre 8 e 17 horas.',
            );
        }

        const findAppointmentInSameDate = await this.appointmentsRepository.findByDate(
            appointmentDate,
            provider_id,
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
            user_id,
            date: appointmentDate,
        });

        const dateFormated = format(appointmentDate, "dd/MM/yyyy 'às' HH:mm");

        await this.notificationsRepository.create({
            recipient_id: provider_id,
            content: `Novo agendamento para a data de ${dateFormated}.`,
        });

        /**
         * Exclui a entrada de cache com a chave especificada
         */
        const cacheKey = `provider-appointments:${provider_id}:${format(
            appointmentDate,
            'yyyy-M-d',
        )}`;

        await this.cacheProvider.invalidate(cacheKey);

        return appointment;
    }
}

export default CreateAppointmentService;
