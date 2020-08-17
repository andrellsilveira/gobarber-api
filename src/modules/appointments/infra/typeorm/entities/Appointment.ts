// Ao utilizar entity do TypeORM a geração do UUID é realizada pelo Decorator
// import { uuid } from 'uuidv4';
import {
    Entity,
    Column,
    PrimaryGeneratedColumn,
    CreateDateColumn,
    UpdateDateColumn,
    ManyToOne,
    JoinColumn,
} from 'typeorm';

import User from '@modules/users/infra/typeorm/entities/User';

/**
 * O Decorator "@Entity" é utilizado para indicar a qual tabela esse model faz referência.
 * */
@Entity('appointments')
class Appointment {
    /**
     * O Decorator "@PrimaryGeneratedColumn" indica que o atributo é uma chave da tabela e deve
     * ser gerado automaticamente conforme o parâmetro especificado
     */
    @PrimaryGeneratedColumn('uuid')
    id: string;

    /**
     * O Decorator "@Column" indica que o atributo é uma coluna da tabela
     * Se não for passado nenhum parâmetro para o Decorator, assumirá que
     * a coluna é do tipo varchar
     */
    @Column()
    provider_id: string;

    /**
     * O Decorator "@ManyToOne" indica que um prestador (User) pode ter vários
     * agendamentos (Appointments)
     */
    @ManyToOne(() => User)
    /**
     * O Decorator "@JoinColumn" indica com qual atributo a instância da classe externa
     * vai se relacionar
     */
    @JoinColumn({ name: 'provider_id' })
    /**
     * Ess propriedade é necessária para termos o relacionamento entre o model de
     * Appointment e o model User
     */
    provider: User;

    @Column()
    user_id: string;

    /**
     * A propriedade "eager" indica que os dados do objeto relacionado devem ser carregados
     * automaticamente ao carregar os dados desta classe
     */
    @ManyToOne(() => User /* , { eager: true } */)
    @JoinColumn({ name: 'user_id' })
    user: User;

    @Column('time with time zone')
    date: Date;

    @CreateDateColumn()
    created_at: Date;

    @UpdateDateColumn()
    updated_at: Date;

    /*
     * A função helper "Omit" permite indicar os atributos da classe que não poderão ser passados
     * como parâmetro para o método, nesse caso o próprio construtor da classe.
     * @param data
     */
    /** Aqui é possível desestruturar: constructor({ provider, date }: Omit<Appointment, 'id'>) { */
    /*
    Ao utilizar Decorators não é necessário especificar um construtor para a classe
    constructor(data: Omit<Appointment, 'id'>) {
        this.id = uuid();
        this.provider = data.provider;
        this.date = data.date;
    }
    */
}

export default Appointment;
