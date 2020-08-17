import { injectable, inject } from 'tsyringe';
import { getDaysInMonth, getDate, isAfter } from 'date-fns';

import IAppointmentsRepository from '@modules/appointments/repositories/IAppointmentsRepository';

interface IResquest {
    provider_id: string;
    month: number;
    year: number;
}

/**
 * Cria uma tipagem do tipo Array
 * Essa tipagem é equivalente à declaração de "interface"
 */
type IResponse = Array<{
    day: number;
    available: boolean;
}>;

@injectable()
class ListProviderMonthAvailability {
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
    }: IResquest): Promise<IResponse> {
        const appointments = await this.appointmentsRepository.findAllInMonthFromProvider(
            {
                provider_id,
                month,
                year,
            },
        );

        const numberOfDaysInMonth = getDaysInMonth(new Date(year, month - 1));

        /**
         * Cria um array a partir dos parâmetros especificados, onde:
         * 1º parâmetro: Tamanho do array
         * 2º parâmetro: Função executada para preenchimento das posições do array
         */
        const eachDayArray = Array.from(
            { length: numberOfDaysInMonth },
            (_, index) => index + 1,
        );

        const availability = eachDayArray.map(day => {
            const compareDate = new Date(year, month - 1, day, 23, 59, 59);

            const appointmentsInDay = appointments.filter(appointment => {
                return getDate(appointment.date) === day;
            });

            return {
                day,
                /**
                 * Na regra de negócio, de acordo com os horários disponiveis para agendamento
                 * (8h às 17h), são possíveis 10 agendamentos, assim, caso essa quantidade não
                 * tenha sido atingida, então há horário disponível
                 */
                available:
                    isAfter(compareDate, new Date()) &&
                    appointmentsInDay.length < 10,
            };
        });

        return availability;
    }
}

export default ListProviderMonthAvailability;
