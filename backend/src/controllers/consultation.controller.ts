/**
 * Controlador de Consultas P2P y Mensajería
 * InmoVAX Backend - Patrón Controlador (Capa de Presentación / HTTP)
 */

import { Context } from 'hono';
import { z } from 'zod';
import { ConsultationService } from '../services/consultation.service';
import { newConsultationSchema, consultationReplySchema } from '../models/consultation.model';

export class ConsultationController {
  /**
   * POST /api/consultations: Registrar consulta Comprador -> Vendedor
   */
  static async createConsultation(c: Context) {
    try {
      const body = await c.req.json();
      const validated = newConsultationSchema.parse(body);
      const consultation = await ConsultationService.createConsultation(validated);

      return c.json({
        success: true,
        source: 'supabase-postgresql',
        message: 'Consulta enviada exitosamente al vendedor',
        consultation
      }, 201);
    } catch (err: any) {
      if (err instanceof z.ZodError) {
        return c.json({ success: false, error: 'Validación fallida', details: err.errors }, 400);
      }
      return c.json({ success: false, error: err.message || 'Error al procesar la consulta' }, 500);
    }
  }

  /**
   * POST /api/consultations/:id/reply: Responder a una consulta
   */
  static async replyConsultation(c: Context) {
    const consultationId = c.req.param('id') || '';
    try {
      const body = await c.req.json();
      const validated = consultationReplySchema.parse(body);
      const consultation = await ConsultationService.replyConsultation(
        consultationId,
        validated.replyText,
        body.senderEmail,
        body.senderName
      );

      return c.json({
        success: true,
        source: 'supabase-postgresql',
        message: 'Respuesta enviada exitosamente',
        consultation
      });
    } catch (err: any) {
      if (err instanceof z.ZodError) {
        return c.json({ success: false, error: 'Validación fallida', details: err.errors }, 400);
      }
      const status = err.statusCode || 500;
      return c.json({ success: false, error: err.message || 'Error al enviar respuesta' }, status);
    }
  }

  /**
   * GET /api/consultations/seller/:email: Consultas del vendedor
   */
  static async getSellerConsultations(c: Context) {
    const email = decodeURIComponent(c.req.param('email') || '');
    try {
      const consultations = await ConsultationService.getSellerConsultations(email);
      return c.json({
        success: true,
        source: 'supabase-postgresql',
        sellerEmail: email,
        total: consultations.length,
        consultations
      });
    } catch (err: any) {
      return c.json({ success: false, error: err.message, total: 0, consultations: [] }, 500);
    }
  }

  /**
   * GET /api/consultations/buyer/:email: Consultas del comprador
   */
  static async getBuyerConsultations(c: Context) {
    const email = decodeURIComponent(c.req.param('email') || '');
    try {
      const consultations = await ConsultationService.getBuyerConsultations(email);
      return c.json({
        success: true,
        source: 'supabase-postgresql',
        buyerEmail: email,
        total: consultations.length,
        consultations
      });
    } catch (err: any) {
      return c.json({ success: false, error: err.message, total: 0, consultations: [] }, 500);
    }
  }

  /**
   * GET /api/consultations/:id: Detalle de conversación individual
   */
  static async getConsultationById(c: Context) {
    const id = c.req.param('id') || '';
    try {
      const consultation = await ConsultationService.getConsultationById(id);
      if (!consultation) {
        return c.json({ success: false, error: 'Conversación no encontrada' }, 404);
      }
      return c.json({
        success: true,
        source: 'supabase-postgresql',
        consultation
      });
    } catch (err: any) {
      return c.json({ success: false, error: err.message }, 500);
    }
  }

  /**
   * GET /api/consultations: Listar todas las consultas (Admin)
   */
  static async getAllConsultations(c: Context) {
    try {
      const consultations = await ConsultationService.getAllConsultations();
      return c.json({ success: true, total: consultations.length, consultations });
    } catch (err: any) {
      return c.json({ success: false, error: err.message, consultations: [] }, 500);
    }
  }
}
