/**
 * Interfaces y Contratos de Datos para Pagos y Planes en InmoVAX
 * Arquitectura en Capas - Capa de Interfaces
 */

export type PlanId = 'basico' | 'oro' | 'diamante';
export type PaymentStatus = 'pending' | 'submitted' | 'approved' | 'rejected';

export interface IPublicationPlan {
  id: PlanId;
  name: string;
  badgeColor: string;
  durationLabel: string;
  durationDays: number | null;
  price: number;
  currency: 'USD' | 'BOB';
  exposure: string;
  features: {
    canalesInmoVAX: boolean;
    soporte: string;
  };
}
export type PublicationPlan = IPublicationPlan;

export interface PropertyPaymentOrder {
  id: string;
  propertyId: string;
  propertyTitle?: string;
  sellerEmail: string;
  sellerName?: string;
  planId: string;
  planName: string;
  amount: number;
  currency: string;
  qrCodeData?: string;
  qrData?: string;
  receiptUrl?: string | null;
  status: 'pendiente' | 'aprobado' | 'rechazado' | 'exento_vip' | PaymentStatus;
  rejectionReason?: string | null;
  createdAt: string;
  reviewedAt?: string | null;
}

export interface IPaymentOrder {
  id: string;
  propertyId: string;
  propertyTitle: string;
  sellerEmail: string;
  sellerName?: string;
  planId: PlanId;
  planName: string;
  amount: number;
  currency: 'USD' | 'BOB';
  qrData: string;
  status: PaymentStatus;
  createdAt: string;
  receiptUrl?: string;
  submittedAt?: string;
  reviewedAt?: string;
  reviewerNotes?: string;
}

export interface ICreatePaymentOrderDTO {
  propertyId: string;
  propertyTitle?: string;
  sellerEmail: string;
  sellerName?: string;
  planId: PlanId;
}

export interface IConfirmPaymentDTO {
  orderId: string;
  receiptUrl: string;
}

export interface IReviewPaymentDTO {
  action?: 'aprobar' | 'rechazar';
  decision?: 'approve' | 'reject';
  reason?: string;
  notes?: string;
}
