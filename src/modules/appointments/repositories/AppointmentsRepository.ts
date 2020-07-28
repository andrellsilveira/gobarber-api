// import { isEqual } from 'date-fns';
import { EntityRepository, Repository } from 'typeorm';

import Appointment from '@modules/appointments/infra/typeorm/entities/Appointment';

/**
 * O Decorator "@EntityRepository" indica qual é o model ao qual esse repositório faz
 * referência, conforme o parâmetro especificado para o mesmo
 */
@EntityRepository(Appointment)
/**
 * Ao herdar a classe "Repository" temos a disposição vários métodos para manipulação dos
 * registros do model especificado como parâmetro
 */
class AppointmentsRepository extends Repository<Appointment> {
    /**
     * Método que buscará um objeto a apartir de uma data
     * Retorno: Appointment ou nulo
     * @param date
     */
    public async findByDate(date: Date): Promise<Appointment | null> {
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
        const findAppointment = await this.findOne({
            /**
             * Busca onde o campo "date" da tabela "appointments" seja igual ao parâmetros
             * "date" passado para o método
             * A forma abaixo foi reduzida devido ao nome da coluna ser o mesmo do parâmetro
             */
            where: { date },
        });

        /**
         * Retorna o objeto encontrado ou (||) nulo
         */
        return findAppointment || null;
    }

    /**
     * INFORMAÇÃO!! O método "findByDate" por ser assíncrono sempre retornará uma Promisse,
     * assim, é possível utlizá-lo com o método "then", o qual retornará uma resposta após
     * finalizado, por exemplo: findByDate('00/00/0000').then(response => ...);
     */
}

export default AppointmentsRepository;
