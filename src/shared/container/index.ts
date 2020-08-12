import { container } from 'tsyringe';

import '@shared/container/providers';
import '@modules/users/providers';

import IUsersRepository from '@modules/users/repositories/IUsersRepository';
import UsersRepository from '@modules/users/infra/typeorm/repositories/UsersRepository';

import IUserTokensRepository from '@modules/users/repositories/IUserTokensRepository';
import UserTokensRepository from '@modules/users/infra/typeorm/repositories/UserTokensRepository';

import IAppointmentsRepository from '@modules/appointments/repositories/IAppointmentsRepository';
import AppointmentsRepository from '@modules/appointments/infra/typeorm/repositories/AppointmentsRepository';

import INotificationsRepository from '@modules/notifications/repositories/INotificationsRepository';
import NotificationsRepository from '@modules/notifications/infra/typeorm/repositories/NotificationsRepository';

/**
 * Registra o repositório do tipo "IUsersRepository" apenas uma vez ao longo do ciclo
 * de vida da aplicação (Singleton), onde o primeiro parâmetro é um identificador
 * para o registro e o segundo é o recurso que deverá ser injetado
 */
container.registerSingleton<IUsersRepository>(
    'UsersRepository',
    UsersRepository,
);

container.registerSingleton<IUserTokensRepository>(
    'UserTokensRepository',
    UserTokensRepository,
);

container.registerSingleton<IAppointmentsRepository>(
    'AppointmentsRepository',
    AppointmentsRepository,
);

container.registerSingleton<INotificationsRepository>(
    'NotificationsRepository',
    NotificationsRepository,
);
