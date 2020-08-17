import { Request, Response } from 'express';
import { container } from 'tsyringe';

import ListProviderAppointmentsService from '@modules/appointments/services/ListProviderAppointmentsService';

/**
 * Seguindo os princípios da arquitetura RESTFUL um controlador não deve ter mais de 5
 * métodos:
 * - index: Retornar uma lista de registros
 * - show: Retornar um único registro
 * - create: Inserir um registro
 * - update: Atualizar um registro
 * - delete: Excluir um registro
 */

class ProviderAppointmentsController {
    public async index(
        request: Request,
        response: Response,
    ): Promise<Response> {
        const provider_id = request.user.id;
        const { day, month, year } = request.query;

        const listProviderAppointmentsService = container.resolve(
            ListProviderAppointmentsService,
        );

        const appointments = await listProviderAppointmentsService.execute({
            provider_id,
            day: Number(day),
            month: Number(month),
            year: Number(year),
        });

        return response.json(appointments);
    }
}

export default ProviderAppointmentsController;
