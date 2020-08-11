import { MongoRepository, getMongoRepository } from 'typeorm';

import Notification from '@modules/notifications/infra/typeorm/schemas/Notification';
import INotificationsRepository from '@modules/notifications/repositories/INotificationsRepository';
import ICreateNotificationDTO from '@modules/notifications/dtos/ICreateNotificationDTO';

class NotificationsRepository implements INotificationsRepository {
    private ormRepository: MongoRepository<Notification>;

    constructor() {
        /**
         * Quando existir mais de um banco de dados na aplicação e este não for a opção com o
         * nome "default", sempre que ele for utilizado deverá ser passado seu nome para a
         * função "getRepository"
         */
        this.ormRepository = getMongoRepository(Notification, 'mongo');
    }

    public async create({
        recipient_id,
        content,
    }: ICreateNotificationDTO): Promise<Notification> {
        const notification = this.ormRepository.create({
            recipient_id,
            content,
        });

        /**
         * Método utilizado para gravar o registro no banco de dados
         */
        await this.ormRepository.save(notification);

        return notification;
    }
}

export default NotificationsRepository;
