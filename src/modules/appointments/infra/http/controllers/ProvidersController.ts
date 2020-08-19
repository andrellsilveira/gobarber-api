import { Request, Response } from 'express';
import { container } from 'tsyringe';
import { classToClass } from 'class-transformer';

import ListProvidersService from '@modules/appointments/services/ListProvidersService';

/**
 * Seguindo os princípios da arquitetura RESTFUL um controlador não deve ter mais de 5
 * métodos:
 * - index: Retornar uma lista de registros
 * - show: Retornar um único registro
 * - create: Inserir um registro
 * - update: Atualizar um registro
 * - delete: Excluir um registro
 */

class ProvidersController {
    public async index(
        request: Request,
        response: Response,
    ): Promise<Response> {
        const userId = request.user.id;

        const listProvidersService = container.resolve(ListProvidersService);

        const providers = await listProvidersService.execute({ userId });

        return response.json(classToClass(providers));
    }
}

export default ProvidersController;
