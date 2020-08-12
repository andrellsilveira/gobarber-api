import { Request, Response } from 'express';
import { parseISO } from 'date-fns';
import { container } from 'tsyringe';

import CreateAppointmentService from '@modules/appointments/services/CreateAppointmentService';

/**
 * Seguindo os princípios da arquitetura RESTFUL um controlador não deve ter mais de 5
 * métodos:
 * - index: Retornar uma lista de registros
 * - show: Retornar um único registro
 * - create: Inserir um registro
 * - update: Atualizar um registro
 * - delete: Excluir um registro
 */

class AppointmentsController {
    public async create(
        request: Request,
        response: Response,
    ): Promise<Response> {
        const user_id = request.user.id;
        const { provider_id, date } = request.body;

        /**
         * Converte a data para o formato ISO
         * --------------
         * Não é mais necessário, pois a conversão está sendo realizada pela biblioteca "Joi"
         * na validação do campo na rota de appointments
         * --------------
         * */
        // const parsedDate = parseISO(date);

        const createAppointment = container.resolve(CreateAppointmentService);

        const appointment = await createAppointment.execute({
            provider_id,
            user_id,
            date,
        });

        return response.json(appointment);
    }
}

export default AppointmentsController;
