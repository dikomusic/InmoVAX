/**
 * Rutas de Pagos y Planes de Publicación
 * InmoVAX Backend - Enrutador Delgado (Delegación a Controladores)
 */

import { Hono } from 'hono';
import { PaymentController } from '../controllers/payment.controller';
import { requireAdmin } from '../middleware/auth';

export const paymentsRouter = new Hono();

// Planes de Publicación
paymentsRouter.get('/plans', PaymentController.getPlans);
paymentsRouter.put('/plans/:planId', requireAdmin, PaymentController.updatePlan);

// Órdenes y Comprobantes QR
paymentsRouter.post('/create-order', PaymentController.createOrder);
paymentsRouter.post('/confirm', PaymentController.confirmPayment);
paymentsRouter.post('/review', requireAdmin, PaymentController.reviewPayment);
paymentsRouter.post('/upload-receipt', PaymentController.uploadReceipt);

// Auditoría y Listado
paymentsRouter.get('/orders', requireAdmin, PaymentController.getAllOrders);
paymentsRouter.get('/orders/seller/:email', PaymentController.getSellerOrders);
