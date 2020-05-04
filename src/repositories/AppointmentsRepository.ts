import { isEqual } from 'date-fns';

import Appointment from '../models/Appointment';

class AppointmentsRepository {
    private appointments: Appointment[];

    constructor() {
        this.appointments = [];
    }

    /**
     * Método que buscará um objeto a apartir de uma data
     * Retorno: Appointment ou nulo
     * @param date 
     */
    public findByDate(date: Date): Appointment | null {
        /**
         * Realiza pesquisa dentro do array para verificar se já existe um objeto com a mesma data
         * do agendamento que está sendo criado
         */
        const findAppointment = this.appointments.find(appointment => isEqual(date, appointment.date));

        /**
         * Retorna o objeto encontrado ou (||) nulo
         */
        return findAppointment || null;
    }

    /**
     * Método que realiza a criação de um Appointment
     * @param provider 
     * @param date 
     */
    public create(provider: string, date: Date): Appointment {
        const appointment = new Appointment(provider, date);

        this.appointments.push(appointment);

        return appointment;
    }
}

export default AppointmentsRepository;