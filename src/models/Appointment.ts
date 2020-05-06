import { uuid } from 'uuidv4';

class Appointment {
    id: string;

    provider: string;

    date: Date;

    /**
     * A função helper "Omit" permite indicar os atributos da classe que não poderão ser passados
     * como parâmetro para o método, nesse caso o próprio construtor da classe.
     * @param data
     */
    /** Aqui é possível desestruturar: constructor({ provider, date }: Omit<Appointment, 'id'>) { */
    constructor(data: Omit<Appointment, 'id'>) {
        this.id = uuid();
        this.provider = data.provider;
        this.date = data.date;
    }
}

export default Appointment;
