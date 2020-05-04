import { Router } from 'express';
import appointmentsRouter from './appointments.routes';

const routes = Router();

/**
 * Faz a indicação de que todas as rotas iniciadas com "/appointments" sejam tratadas
 * pelo Router "appointmentsRouter" 
*/
routes.use('/appointments', appointmentsRouter);

export default routes;
