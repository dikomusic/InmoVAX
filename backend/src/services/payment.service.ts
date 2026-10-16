/**
 * Servicio de Pagos y Planes de Publicación (Capa de Lógica de Negocio)
 * InmoVAX Backend - Patrón Servicio
 */

import { PaymentRepository } from '../repositories/payment.repository';
import { PropertyRepository } from '../repositories/property.repository';
import { UserRepository } from '../repositories/user.repository';
import { IPublicationPlan, PropertyPaymentOrder, ICreatePaymentOrderDTO, IConfirmPaymentDTO, IReviewPaymentDTO } from '../interfaces/payment.interface';

export class PaymentService {
  /**
   * Obtener todos los planes disponibles
   */
  static getPlans(): Record<string, IPublicationPlan> {
    return PaymentRepository.getPlans();
  }

  /**
   * Actualizar configuración de un plan de publicación
   */
  static updatePlan(planId: string, updates: Partial<IPublicationPlan>): IPublicationPlan {
    const updated = PaymentRepository.updatePlan(planId, updates);
    if (!updated) {
      const notFoundError: any = new Error(`Plan con ID "${planId}" no encontrado.`);
      notFoundError.statusCode = 404;
      throw notFoundError;
    }
    return updated;
  }

  /**
   * Crear nueva orden de pago con generación de código QR Simple
   */
  static async createOrder(dto: ICreatePaymentOrderDTO): Promise<PropertyPaymentOrder> {
    const plan = PaymentRepository.getPlanById(dto.planId);
    if (!plan) {
      throw new Error(`El plan seleccionado "${dto.planId}" no existe.`);
    }

    // Verificar si el usuario cuenta con exención por rol en la base de datos (role_id 4 = Admin)
    let isExempt = false;
    if (dto.sellerEmail) {
      const profile = await UserRepository.findByEmail(dto.sellerEmail);
      if (profile?.role_id === 4) {
        isExempt = true;
      }
    }

    const orderId = `PAY-${Date.now().toString().slice(-6)}-${Math.floor(100 + Math.random() * 900)}`;
    const qrData = `INMOVAX|BCP|CTA-201-50892341|BOB|${plan.price}|ORD-${orderId}|REF-INMUEBLE-${dto.propertyId}`;

    const order: PropertyPaymentOrder = {
      id: orderId,
      propertyId: dto.propertyId,
      propertyTitle: dto.propertyTitle || `Inmueble #${dto.propertyId}`,
      sellerEmail: dto.sellerEmail,
      sellerName: dto.sellerName || 'Propietario InmoVAX',
      planId: dto.planId,
      planName: plan.name,
      amount: plan.price,
      currency: plan.currency,
      qrCodeData: qrData,
      status: isExempt ? 'exento_vip' : 'pendiente',
      receiptUrl: null,
      createdAt: new Date().toISOString()
    };

    return PaymentRepository.saveOrder(order);
  }

  /**
   * Adjuntar comprobante de pago QR para auditoría
   */
  static confirmPayment(dto: IConfirmPaymentDTO): PropertyPaymentOrder {
    const order = PaymentRepository.findOrderById(dto.orderId);
    if (!order) {
      const notFoundError: any = new Error(`Orden de pago "${dto.orderId}" no encontrada.`);
      notFoundError.statusCode = 404;
      throw notFoundError;
    }

    const updated = PaymentRepository.updateOrder(dto.orderId, {
      receiptUrl: dto.receiptUrl,
      status: 'pendiente'
    });

    return updated!;
  }

  /**
   * Aprobar o rechazar orden de pago por el Administrador
   */
  static async reviewPayment(orderId: string, dto: IReviewPaymentDTO): Promise<PropertyPaymentOrder> {
    const order = PaymentRepository.findOrderById(orderId);
    if (!order) {
      const notFoundError: any = new Error(`Orden de pago "${orderId}" no encontrada.`);
      notFoundError.statusCode = 404;
      throw notFoundError;
    }

    const isApproved = dto.action === 'aprobar' || dto.decision === 'approve';
    const nowIso = new Date().toISOString();

    const updated = PaymentRepository.updateOrder(orderId, {
      status: isApproved ? 'aprobado' : 'rechazado',
      rejectionReason: !isApproved ? (dto.reason || dto.notes || 'Comprobante no legible o monto incorrecto') : null,
      reviewedAt: nowIso
    });

    // Si se aprueba el pago, activar automáticamente el inmueble en la base de datos
    if (isApproved) {
      const prop = await PropertyRepository.findSafely(order.propertyId);
      if (prop) {
        await PropertyRepository.updateStatus(prop.id, 1); // 1 = Activo / Publicado
      }
    }

    return updated!;
  }

  /**
   * Listar todas las órdenes de pago (para el panel administrativo)
   */
  static getAllOrders(statusFilter?: string): PropertyPaymentOrder[] {
    return PaymentRepository.findAllOrders(statusFilter);
  }

  /**
   * Listar órdenes asociadas a un vendedor específico
   */
  static getSellerOrders(sellerEmail: string): PropertyPaymentOrder[] {
    return PaymentRepository.findOrdersBySeller(sellerEmail);
  }
}
