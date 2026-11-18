/**
 * Esquemas de Validación y Modelos de Entrada para Consultas y Mensajes
 * InmoVAX Backend - Capa de Modelos (Zod)
 */

import { z } from 'zod';

export const newConsultationSchema = z.object({
  id: z.string().optional(),
  propertyId: z.string().optional(),
  propertyTitle: z.string().min(1, 'El título de la propiedad es requerido'),
  propertyLocation: z.string().optional().default('La Paz, Bolivia'),
  propertyPrice: z.string().optional().default('A convenir'),
  propertyImage: z.string().optional().default(''),
  propertyHref: z.string().optional(),
  sellerEmail: z.string().email('Email de vendedor inválido').optional(),
  sellerName: z.string().optional().default('Propietario'),
  buyerEmail: z.string().min(3, 'Email del comprador requerido'),
  buyerName: z.string().min(1, 'Nombre del comprador requerido'),
  buyerPhone: z.string().optional(),
  messageText: z.string().min(1, 'El mensaje no puede estar vacío'),
});

export const consultationInputSchema = newConsultationSchema;


export const consultationReplySchema = z.object({
  replyText: z.string().min(1, 'La respuesta no puede estar vacía').max(1500),
  senderEmail: z.string().email('Email inválido').optional(),
  senderName: z.string().min(1).optional(),
  senderRole: z.enum(['vendedor', 'comprador']).optional()
});

export type ConsultationInputModel = z.infer<typeof consultationInputSchema>;
export type ConsultationReplyModel = z.infer<typeof consultationReplySchema>;
