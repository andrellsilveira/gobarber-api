// Ao utilizar entity do TypeORM a geração do UUID é realizada pelo Decorator
// import { uuid } from 'uuidv4';
import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

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
    provider: string;

    @Column('time with time zone')
    date: Date;

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
