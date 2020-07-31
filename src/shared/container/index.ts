import { container } from 'tsyringe';

import '@modules/users/providers';
import '@shared/container/providers';

import IUsersRepository from '@modules/users/repositories/IUsersRepository';
import UsersRepository from '@modules/users/infra/typeorm/repositories/UsersRepository';

import IAppointmentsRepository from '@modules/appointments/repositories/IAppointmentsRepository';
import AppointmentssRepository from '@modules/appointments/infra/typeorm/repositories/AppointmentsRepository';

/**
 * Registra o repositório do tipo "IUsersRepository" apenas uma vez ao longo do ciclo
 * de vida da aplicação (Singleton), onde o primeiro parâmetro é um identificador
 * para o registro e o segundo é o recurso que deverá ser injetado
 */
container.registerSingleton<IUsersRepository>(
    'UsersRepository',
    UsersRepository,
);

container.registerSingleton<IAppointmentsRepository>(
    'AppointmentssRepository',
    AppointmentssRepository,
);
