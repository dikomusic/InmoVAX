/**
 * Interfaces y Contratos de Datos para Consultas y Mensajería P2P en InmoVAX
 * Arquitectura en Capas - Capa de Interfaces
 */

export type ConsultationStatus = 'pendiente' | 'respondido';

export interface ChatMessageDto {
  id: string;
  senderEmail: string;
  senderName: string;
  senderRole: 'comprador' | 'vendedor';
  text: string;
  timestamp: string;
}

export interface IConsultation {
  id: string;
  propertyId?: string;
  propertyTitle: string;
  propertyLocation?: string;
  propertyPrice?: string;
  propertyImage?: string;
  propertyHref?: string;
  sellerEmail: string;
  sellerName?: string;
  buyerEmail: string;
  buyerName: string;
  buyerPhone?: string;
  status: ConsultationStatus;
  lastMessage: string;
  date: string;
  messages: ChatMessageDto[];
  unreadBySeller: number;
  unreadByBuyer: number;
  createdAt?: string;
  messageText?: string;
}

export type ConsultationDto = IConsultation;

export interface ICreateConsultationDTO {
  id?: string;
  propertyId?: string;
  propertyTitle: string;
  propertyLocation?: string;
  propertyPrice?: string;
  propertyImage?: string;
  propertyHref?: string;
  sellerEmail?: string;
  sellerName?: string;
  buyerEmail: string;
  buyerName: string;
  buyerPhone?: string;
  messageText: string;
}

export interface IReplyConsultationDTO {
  replyText: string;
  senderEmail?: string;
  senderName?: string;
}
