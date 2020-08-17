import { injectable, inject } from 'tsyringe';
import { classToClass } from 'class-transformer';

import Appointment from '@modules/appointments/infra/typeorm/entities/Appointment';
import IAppointmentsRepository from '@modules/appointments/repositories/IAppointmentsRepository';
import ICacheProvider from '@shared/container/providers/CacheProvider/models/ICacheProvider';

interface IResquest {
    provider_id: string;
    day: number;
    month: number;
    year: number;
}

@injectable()
class ListProviderAppointmentsService {
    private appointmentsRepository: IAppointmentsRepository;

    private cacheProvider: ICacheProvider;

    constructor(
        @inject('AppointmentsRepository') repository: IAppointmentsRepository,
        @inject('CacheProvider') cache: ICacheProvider,
    ) {
        this.appointmentsRepository = repository;
        this.cacheProvider = cache;
    }

    public async execute({
        provider_id,
        day,
        month,
        year,
    }: IResquest): Promise<Appointment[]> {
        /**
         * Recupera os dados do cache com a chave especificada
         */
        const cacheKey = `provider-appointments:${provider_id}:${year}-${month}-${day}`;

        let appointments = await this.cacheProvider.recover<Appointment[]>(
            cacheKey,
        );
        /**
         * Caso os dados não tenham sido recuperados do cache, então devem ser recuperados do
         * banco de dados
         */
        if (!appointments) {
            appointments = await this.appointmentsRepository.findAllInDayFromProvider(
                {
                    provider_id,
                    day,
                    month,
                    year,
                },
            );

            /**
             * Executa a gravação do cache serializando o objeto de appointments
             */
            await this.cacheProvider.save(cacheKey, classToClass(appointments));
        }

        return appointments;
    }
}

export default ListProviderAppointmentsService;
