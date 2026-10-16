/**
 * Esquemas de Validación y Modelos de Entrada para Pagos y Planes
 * InmoVAX Backend - Capa de Modelos (Zod)
 */

import { z } from 'zod';

export const createPaymentOrderSchema = z.object({
  propertyId: z.string().min(1, 'El ID de propiedad es requerido'),
  propertyTitle: z.string().optional(),
  sellerEmail: z.string().email('El correo de vendedor no es válido'),
  sellerName: z.string().optional(),
  planId: z.enum(['basico', 'oro', 'diamante'])
});

export const confirmPaymentSchema = z.object({
  orderId: z.string().min(1, 'El ID de orden es obligatorio'),
  receiptUrl: z.string().min(1, 'La URL del comprobante es requerida')
});

export const reviewPaymentSchema = z.object({
  orderId: z.string().optional(),
  action: z.enum(['aprobar', 'rechazar']).optional(),
  decision: z.enum(['approve', 'reject']).optional(),
  reason: z.string().optional(),
  notes: z.string().optional()
});

export type CreatePaymentOrderModel = z.infer<typeof createPaymentOrderSchema>;
export type ConfirmPaymentModel = z.infer<typeof confirmPaymentSchema>;
export type ReviewPaymentModel = z.infer<typeof reviewPaymentSchema>;
