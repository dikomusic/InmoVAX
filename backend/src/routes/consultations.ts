/**
 * Rutas de Consultas P2P y Mensajería
 * InmoVAX Backend - Enrutador Delgado (Delegación a Controladores)
 */

import { Hono } from 'hono';
import { ConsultationController } from '../controllers/consultation.controller';

export const consultationsRouter = new Hono();

// Mensajería y Conversaciones
consultationsRouter.post('/', ConsultationController.createConsultation);
consultationsRouter.post('/:id/reply', ConsultationController.replyConsultation);

// Bandejas de Entrada
consultationsRouter.get('/seller/:email', ConsultationController.getSellerConsultations);
consultationsRouter.get('/buyer/:email', ConsultationController.getBuyerConsultations);
consultationsRouter.get('/:id', ConsultationController.getConsultationById);

// Auditoría Administrativa
consultationsRouter.get('/', ConsultationController.getAllConsultations);
