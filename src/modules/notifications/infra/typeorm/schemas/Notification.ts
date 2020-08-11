// Ao utilizar entity do TypeORM a geração do UUID é realizada pelo Decorator
// import { uuid } from 'uuidv4';
import {
    Entity,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
    ObjectID,
    ObjectIdColumn,
} from 'typeorm';

import User from '@modules/users/infra/typeorm/entities/User';

/**
 * O Decorator "@Entity" é utilizado para indicar a qual tabela esse model faz referência.
 * */
@Entity('notifications')
class Notification {
    @ObjectIdColumn()
    /**
     * O tipo ObjectID do MongoDB é equivelente ao UUID do PostgreSQL
     */
    id: ObjectID;

    @Column()
    content: string;

    @Column('uuid')
    recipient_id: string;

    /**
     * Define o valor padrão do campo, pois como não há migrations para a criação das tabelas
     * não é possível definir o valor que deverá ser inicializado de outra forma
     */
    @Column({ default: false })
    read: boolean;

    @CreateDateColumn()
    created_at: Date;

    @UpdateDateColumn()
    updated_at: Date;
}

export default Notification;
