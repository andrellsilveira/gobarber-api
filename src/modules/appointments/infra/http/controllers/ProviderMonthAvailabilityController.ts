import { Request, Response } from 'express';
import { container } from 'tsyringe';

import ListProviderMonthAvailabilityService from '@modules/appointments/services/ListProviderMonthAvailabilityService';

/**
 * Seguindo os princípios da arquitetura RESTFUL um controlador não deve ter mais de 5
 * métodos:
 * - index: Retornar uma lista de registros
 * - show: Retornar um único registro
 * - create: Inserir um registro
 * - update: Atualizar um registro
 * - delete: Excluir um registro
 */

class ProviderMonthAvailabilityController {
    public async index(
        request: Request,
        response: Response,
    ): Promise<Response> {
        const { provider_id } = request.params;
        const { month, year } = request.query;

        const listProviderMonthAvailabilityService = container.resolve(
            ListProviderMonthAvailabilityService,
        );

        const availability = await listProviderMonthAvailabilityService.execute(
            {
                provider_id,
                month: Number(month),
                year: Number(year),
            },
        );

        return response.json(availability);
    }
}

export default ProviderMonthAvailabilityController;
