import { Hono } from 'hono';
import { LegalController } from '../controllers/legal.controller';

export const legalRouter = new Hono();

legalRouter.get('/', LegalController.getLegalAudits);

export type { LegalAuditItem } from '../interfaces/legal.interface';
