/**
 * Agregador y Registro de Rutas
 * InmoVAX Backend - Arquitectura en Capas
 */

import { Hono } from 'hono';
import { healthRouter } from './health';
import { propertiesRouter } from './properties';
import { offersRouter } from './offers';
import { appointmentsRouter } from './appointments';
import { notificationsRouter } from './notifications';
import { advisorsRouter } from './advisors';
import { legalRouter } from './legal';
import { consultationsRouter } from './consultations';
import { authRouter } from './auth';
import { paymentsRouter } from './payments';
import { settingsRouter } from './settings';
import { favoritesRouter } from './favorites';

export function registerRoutes(app: Hono) {
  app.route('/health', healthRouter);
  app.route('/api/auth', authRouter);
  app.route('/api/properties', propertiesRouter);
  app.route('/api/offers', offersRouter);
  app.route('/api/appointments', appointmentsRouter);
  app.route('/api/notifications', notificationsRouter);
  app.route('/api/advisors', advisorsRouter);
  app.route('/api/legal-audits', legalRouter);
  app.route('/api/consultations', consultationsRouter);
  app.route('/api/payments', paymentsRouter);
  app.route('/api/settings', settingsRouter);
  app.route('/api/favorites', favoritesRouter);
}
