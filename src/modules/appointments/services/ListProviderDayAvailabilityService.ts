import { injectable, inject } from 'tsyringe';
import { getHours, isAfter } from 'date-fns';

import IAppointmentsRepository from '@modules/appointments/repositories/IAppointmentsRepository';

interface IResquest {
    provider_id: string;
    day: number;
    month: number;
    year: number;
}

/**
 * Cria uma tipagem do tipo Array
 * Essa tipagem é equivalente à declaração de "interface"
 */
type IResponse = Array<{
    hour: number;
    available: boolean;
}>;

@injectable()
class ListProviderDayAvailability {
    private appointmentsRepository: IAppointmentsRepository;

    constructor(
        @inject('AppointmentsRepository') repository: IAppointmentsRepository,
    ) {
        this.appointmentsRepository = repository;
    }

    public async execute({
        provider_id,
        month,
        year,
        day,
    }: IResquest): Promise<IResponse> {
        const appointments = await this.appointmentsRepository.findAllInDayFromProvider(
            {
                provider_id,
                month,
                year,
                day,
            },
        );

        const hourStart = 8;

        const eachHourArray = Array.from(
            /** Entre 8 e 17 são 10 horários disponíveis, conforme a regra de negócio */
            { length: 10 },
            (_, index) => index + hourStart,
        );

        const currentDate = new Date(Date.now());

        const availability = eachHourArray.map(hour => {
            const hasAppointmentInHour = appointments.find(
                appointment => getHours(appointment.date) === hour,
            );
            /** Formata a data do agendamento */
            const compareDate = new Date(year, month - 1, day, hour, 0, 0);

            return {
                hour,
                /**
                 * Para um horário estar disponível não pode haver agendamento marcado e a
                 * hora deve ser maior que a atual (verificado com a função "isAfter")
                 */
                available:
                    !hasAppointmentInHour && isAfter(compareDate, currentDate),
            };
        });

        return availability;
    }
}

export default ListProviderDayAvailability;
