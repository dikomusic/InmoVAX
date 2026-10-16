/**
 * Controlador de Pagos y Planes de Publicación
 * InmoVAX Backend - Patrón Controlador (Capa de Presentación / HTTP)
 */

import { Context } from 'hono';
import { z } from 'zod';
import { PaymentService } from '../services/payment.service';
import { createPaymentOrderSchema, confirmPaymentSchema, reviewPaymentSchema } from '../models/payment.model';
import { supabase } from '../config/supabase';

export class PaymentController {
  /**
   * GET /api/payments/plans: Obtener todos los planes disponibles
   */
  static getPlans(c: Context) {
    const plans = PaymentService.getPlans();
    return c.json({
      success: true,
      plans: Object.values(plans)
    });
  }

  /**
   * PUT /api/payments/plans/:planId: Modificar precios y configuración de un plan (Super Admin)
   */
  static async updatePlan(c: Context) {
    const planId = c.req.param('planId') || '';
    try {
      const body = await c.req.json();
      const updated = PaymentService.updatePlan(planId, body);
      return c.json({
        success: true,
        message: `Plan "${planId}" actualizado exitosamente`,
        plan: updated
      });
    } catch (err: any) {
      const status = err.statusCode || 500;
      return c.json({ success: false, error: err.message }, status);
    }
  }

  /**
   * POST /api/payments/create-order: Generar orden de pago QR
   */
  static async createOrder(c: Context) {
    try {
      const body = await c.req.json();
      const validated = createPaymentOrderSchema.parse(body);
      const order = await PaymentService.createOrder(validated);

      return c.json({
        success: true,
        message: order.status === 'exento_vip'
          ? 'Usuario Administrador exento de pago. Publicación aprobada de inmediato.'
          : 'Orden de pago generada exitosamente. Escanea el código QR desde tu app bancaria.',
        order
      }, 201);
    } catch (err: any) {
      if (err instanceof z.ZodError) {
        return c.json({ success: false, error: 'Datos de orden inválidos', details: err.format() }, 400);
      }
      return c.json({ success: false, error: err.message || 'Error al procesar orden de pago' }, 500);
    }
  }

  /**
   * POST /api/payments/confirm: Confirmar pago adjuntando comprobante
   */
  static async confirmPayment(c: Context) {
    try {
      const body = await c.req.json();
      const validated = confirmPaymentSchema.parse(body);
      const updated = PaymentService.confirmPayment(validated);

      return c.json({
        success: true,
        message: 'Comprobante de pago recibido. Será auditado por el equipo legal y administrativo.',
        order: updated
      });
    } catch (err: any) {
      if (err instanceof z.ZodError) {
        return c.json({ success: false, error: 'Datos inválidos', details: err.format() }, 400);
      }
      const status = err.statusCode || 500;
      return c.json({ success: false, error: err.message }, status);
    }
  }

  /**
   * POST /api/payments/review: Aprobar o rechazar pago (Administrador)
   */
  static async reviewPayment(c: Context) {
    try {
      const body = await c.req.json();
      const validated = reviewPaymentSchema.parse(body);
      const targetOrderId = c.req.param('orderId') || c.req.param('id') || validated.orderId || '';

      const updated = await PaymentService.reviewPayment(targetOrderId, validated);

      return c.json({
        success: true,
        message: `Orden de pago ${updated.status === 'aprobado' ? 'APROBADA' : 'RECHAZADA'} exitosamente`,
        order: updated
      });
    } catch (err: any) {
      if (err instanceof z.ZodError) {
        return c.json({ success: false, error: 'Datos de auditoría inválidos', details: err.format() }, 400);
      }
      const status = err.statusCode || 500;
      return c.json({ success: false, error: err.message }, status);
    }
  }

  /**
   * GET /api/payments/orders: Listar todas las órdenes (Panel Administrativo)
   */
  static getAllOrders(c: Context) {
    const statusFilter = c.req.query('status');
    const orders = PaymentService.getAllOrders(statusFilter);

    return c.json({
      success: true,
      total: orders.length,
      orders
    });
  }

  /**
   * GET /api/payments/orders/seller/:email: Listar órdenes de un vendedor
   */
  static getSellerOrders(c: Context) {
    const sellerEmail = decodeURIComponent(c.req.param('email') || '');
    const orders = PaymentService.getSellerOrders(sellerEmail);

    return c.json({
      success: true,
      total: orders.length,
      orders
    });
  }

  /**
   * POST /api/payments/upload-receipt: Subir imagen de comprobante bancario
   */
  static async uploadReceipt(c: Context) {
    try {
      const body = await c.req.parseBody();
      const file = body['file'];
      if (!file || !(file instanceof File)) {
        return c.json({ success: false, error: 'No se envió ningún archivo de comprobante' }, 400);
      }

      const ext = file.name.split('.').pop();
      const fileName = `receipt-${Date.now()}-${Math.round(Math.random() * 1000)}.${ext}`;
      const arrayBuffer = await file.arrayBuffer();

      const { data, error } = await supabase.storage
        .from('property-images')
        .upload(fileName, arrayBuffer, {
          contentType: file.type,
        });

      if (error) {
        return c.json({ success: false, error: error.message }, 500);
      }

      const { data: publicUrlData } = supabase.storage
        .from('property-images')
        .getPublicUrl(fileName);

      return c.json({ success: true, url: publicUrlData.publicUrl });
    } catch (err: any) {
      return c.json({ success: false, error: String(err) }, 500);
    }
  }
}
