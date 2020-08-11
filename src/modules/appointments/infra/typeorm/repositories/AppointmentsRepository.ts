// import { isEqual } from 'date-fns';
import { Repository, getRepository, Raw } from 'typeorm';

import IAppointmentsRepository from '@modules/appointments/repositories/IAppointmentsRepository';
import ICreateAppointmentDTO from '@modules/appointments/dtos/ICreateAppointmentDTO';
import IFindAllInMonthFromProviderDTO from '@modules/appointments/dtos/IFindAllInMonthFromProviderDTO';
import IFindAllInDayFromProviderDTO from '@modules/appointments/dtos/IFindAllInDayFromProviderDTO';
import Appointment from '@modules/appointments/infra/typeorm/entities/Appointment';

/**
 * Ao herdar a classe "Repository" temos a disposição vários métodos para manipulação dos
 * registros do model especificado como parâmetro
 */
class AppointmentsRepository implements IAppointmentsRepository {
    /**
     * Cria uma variável privada do tipo repositório de uma entidade
     */
    private ormRepository: Repository<Appointment>;

    /**
     * Construtor da classa inicializado quando um objeto for criado
     */
    constructor() {
        /**
         * Inicializa a variável herdando os métodos do TypeORM através do método getRepository
         */
        this.ormRepository = getRepository(Appointment);
    }

    /**
     * Método que buscará um objeto a apartir de uma data
     * Retorno: Appointment ou undefined
     * @param date
     */
    public async findByDate(date: Date): Promise<Appointment | undefined> {
        /**
         * Realiza pesquisa dentro do array para verificar se já existe um objeto com a mesma data
         * do agendamento que está sendo criado
         */
        /* const findAppointment = this.appointments.find(appointment =>
            isEqual(date, appointment.date),
        ); */

        /**
         * O método "findOne" da classe "Repository" busca por um registro específico,
         * conforme os parâmetros especificados
         */
        const findAppointment = await this.ormRepository.findOne({
            /**
             * Busca onde o campo "date" da tabela "appointments" seja igual ao parâmetros
             * "date" passado para o método
             * A forma abaixo foi reduzida devido ao nome da coluna ser o mesmo do parâmetro
             */
            where: { date },
        });

        /**
         * Retorna o objeto encontrado ou (||) undefined
         */
        return findAppointment;
    }

    public async findAllInMonthFromProvider({
        provider_id,
        year,
        month,
    }: IFindAllInMonthFromProviderDTO): Promise<Appointment[]> {
        const parsedMonth = String(month).padStart(2, '0');

        const appointments = await this.ormRepository.find({
            where: {
                provider_id,
                /**
                 * A variável "dateFieldName" contem o nome do campo definido pelo TypeORM
                 * na query gerada para a consulta
                 */
                date: Raw(
                    dateFieldName =>
                        `to_char(${dateFieldName}, 'MM-YYYY') = '${parsedMonth}-${year}'`,
                ),
            },
        });

        return appointments;
    }

    public async findAllInDayFromProvider({
        provider_id,
        year,
        month,
        day,
    }: IFindAllInDayFromProviderDTO): Promise<Appointment[]> {
        const parsedDay = String(day).padStart(2, '0');
        const parsedMonth = String(month).padStart(2, '0');

        const appointments = await this.ormRepository.find({
            where: {
                provider_id,
                /**
                 * A variável "dateFieldName" contem o nome do campo definido pelo TypeORM
                 * na query gerada para a consulta
                 */
                date: Raw(
                    dateFieldName =>
                        `to_char(${dateFieldName}, 'DD-MM-YYYY') = '${parsedDay}-${parsedMonth}-${year}'`,
                ),
            },
        });

        return appointments;
    }

    /**
     * INFORMAÇÃO!! O método "findByDate" por ser assíncrono sempre retornará uma Promisse,
     * assim, é possível utlizá-lo com o método "then", o qual retornará uma resposta após
     * finalizado, por exemplo: findByDate('00/00/0000').then(response => ...);
     */

    public async create({
        provider_id,
        user_id,
        date,
    }: ICreateAppointmentDTO): Promise<Appointment> {
        /**
         * O método "create" apenas cria uma instância do registro e não o salva no banco de
         * dados. Para salvar é necessário utilizar o método "save"
         */
        const appointment = this.ormRepository.create({
            provider_id,
            user_id,
            date,
        });

        /**
         * Método utilizado para gravar o registro no banco de dados
         */
        await this.ormRepository.save(appointment);

        return appointment;
    }
}

export default AppointmentsRepository;
