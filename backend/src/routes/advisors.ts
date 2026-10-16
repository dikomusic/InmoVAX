import { Hono } from 'hono';
import { AdvisorController } from '../controllers/advisor.controller';

export const advisorsRouter = new Hono();

advisorsRouter.get('/', AdvisorController.getAdvisors);

export type { AdvisorRecord } from '../interfaces/advisor.interface';
