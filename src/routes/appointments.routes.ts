/**
 * Módulo de agendamentos
 */

import { Router } from 'express';
import { startOfHour, parseISO } from 'date-fns';

/**
 * Importa a classe AppointmentsRepository
 */
import AppointmentsRepository from '../repositories/AppointmentsRepository';

/** Instancia o express */
const appointmentsRouter = Router();

/** Importa o repositório */
const appointmentsRepository = new AppointmentsRepository();

appointmentsRouter.get('/', (request, response) => {
    const appointments = appointmentsRepository.all();

    return response.json(appointments);
});

/**
 * Não é necessário apontar o recurso na rota "/appointments", pois essa indicação já está 
 * sendo realizada no arquivo index.ts
 */
appointmentsRouter.post('/', (request, response) => {
    const { provider, date } = request.body;

    /** 
     * Converte a data para o formato ISO e trunca ela em uma hora, zerando os minutos, 
     * segundos e milisegundos 
     * */
    const parsedDate = startOfHour(parseISO(date));

    const findAppointmentInSameDate = appointmentsRepository.findByDate(parsedDate);

    /**
     * Verifica se algum objeto foi encontrado, em caso positivo retorna um erro
     */
    if (findAppointmentInSameDate) {
        return response.status(400).json({ message: 'Já existe um agendamento para essa data e horário.' });
    }

    const appointment = appointmentsRepository.create(provider, parsedDate);

    return response.json(appointment);
});

export default appointmentsRouter;
