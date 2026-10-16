/**
 * Servicio de Consultas P2P y Mensajería (Capa de Lógica de Negocio)
 * InmoVAX Backend - Patrón Servicio
 */

import { ConsultationRepository } from '../repositories/consultation.repository';
import { PropertyRepository } from '../repositories/property.repository';
import { IConsultation, ChatMessageDto, ICreateConsultationDTO } from '../interfaces/consultation.interface';
import { supabase } from '../config/supabase';

function formatDate(isoStr?: string): string {
  if (!isoStr) return 'Reciente';
  try {
    const d = new Date(isoStr);
    const time = d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    const today = new Date();
    if (d.toDateString() === today.toDateString()) {
      return `Hoy, ${time}`;
    }
    return `${d.toLocaleDateString('es-BO', { day: 'numeric', month: 'short' })}, ${time}`;
  } catch {
    return 'Reciente';
  }
}

export class ConsultationService {
  /**
   * Registrar una nueva consulta Comprador -> Vendedor
   */
  static async createConsultation(dto: ICreateConsultationDTO): Promise<IConsultation> {
    const nowIso = new Date().toISOString();
    const cleanSellerEmail = dto.sellerEmail?.toLowerCase().trim() || '';
    const cleanBuyerEmail = dto.buyerEmail.toLowerCase().trim();

    // 1. Resolver UUID de la propiedad
    const propInfo = await ConsultationRepository.resolvePropertyUuid(dto.propertyId);
    const resolvedPropertyId = propInfo?.id || null;

    // 2. Verificar si ya existe una conversación entre este comprador y esta propiedad
    let existingConsultation: any = null;
    if (resolvedPropertyId) {
      const { data } = await supabase
        .from('consultations')
        .select('*')
        .eq('property_id', resolvedPropertyId)
        .eq('buyer_email', cleanBuyerEmail)
        .maybeSingle();
      existingConsultation = data;
    }

    let consultationId: string;

    if (existingConsultation) {
      consultationId = existingConsultation.id;
      await ConsultationRepository.updateConsultation(consultationId, {
        last_message: dto.messageText,
        status: 'pendiente',
        unread_by_seller: (existingConsultation.unread_by_seller || 0) + 1,
        updated_at: nowIso
      });
    } else {
      consultationId = dto.id || `cons-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
      const { data: newRow, error } = await ConsultationRepository.createConsultation({
        id: consultationId,
        property_id: resolvedPropertyId,
        property_title: dto.propertyTitle,
        property_location: dto.propertyLocation || 'La Paz, Bolivia',
        property_price: dto.propertyPrice || 'A convenir',
        property_image: dto.propertyImage || '',
        property_href: dto.propertyHref || (dto.propertyId ? `/propiedad/${dto.propertyId}` : undefined),
        seller_email: cleanSellerEmail,
        seller_name: dto.sellerName || 'Propietario',
        buyer_email: cleanBuyerEmail,
        buyer_name: dto.buyerName,
        buyer_phone: dto.buyerPhone || null,
        status: 'pendiente',
        last_message: dto.messageText,
        unread_by_seller: 1,
        unread_by_buyer: 0,
        created_at: nowIso,
        updated_at: nowIso
      });

      if (error) throw new Error(error.message);
    }

    // 3. Insertar el mensaje inicial
    const messageId = `msg-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;
    await ConsultationRepository.createMessage({
      id: messageId,
      consultation_id: consultationId,
      sender_email: cleanBuyerEmail,
      sender_name: dto.buyerName,
      sender_role: 'comprador',
      text: dto.messageText,
      timestamp: formatDate(nowIso),
      created_at: nowIso
    });

    // 4. Incrementar contador de consultas en la propiedad si existe
    if (resolvedPropertyId && propInfo) {
      PropertyRepository.incrementInquiries(resolvedPropertyId, propInfo.inquiries_count || 0).then();
    }

    const messages = await this.getMessages(consultationId);

    return {
      id: consultationId,
      propertyId: dto.propertyId || resolvedPropertyId || undefined,
      propertyTitle: dto.propertyTitle,
      propertyLocation: dto.propertyLocation || 'La Paz, Bolivia',
      propertyPrice: dto.propertyPrice || 'A convenir',
      propertyImage: dto.propertyImage || '',
      propertyHref: dto.propertyHref,
      sellerEmail: cleanSellerEmail,
      sellerName: dto.sellerName || 'Propietario',
      buyerEmail: cleanBuyerEmail,
      buyerName: dto.buyerName,
      buyerPhone: dto.buyerPhone,
      status: 'pendiente',
      lastMessage: dto.messageText,
      date: formatDate(nowIso),
      messages,
      unreadBySeller: 1,
      unreadByBuyer: 0
    };
  }

  /**
   * Responder a una consulta existente
   */
  static async replyConsultation(consultationId: string, replyText: string, senderEmail?: string, senderName?: string): Promise<IConsultation> {
    const consultation = await ConsultationRepository.findById(consultationId);
    if (!consultation) {
      const notFoundError: any = new Error('Consulta no encontrada');
      notFoundError.statusCode = 404;
      throw notFoundError;
    }

    const nowIso = new Date().toISOString();
    const messageId = `msg-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`;

    // 1. Insertar el mensaje de respuesta
    await ConsultationRepository.createMessage({
      id: messageId,
      consultation_id: consultationId,
      sender_email: senderEmail || consultation.seller_email,
      sender_name: senderName || consultation.seller_name || 'Vendedor',
      sender_role: 'vendedor',
      text: replyText,
      timestamp: formatDate(nowIso),
      created_at: nowIso
    });

    // 2. Actualizar estado de la conversación a respondido
    await ConsultationRepository.updateConsultation(consultationId, {
      status: 'respondido',
      last_message: replyText,
      unread_by_buyer: (consultation.unread_by_buyer || 0) + 1,
      unread_by_seller: 0,
      updated_at: nowIso
    });

    const messages = await this.getMessages(consultationId);

    return {
      id: consultation.id,
      propertyId: consultation.property_id,
      propertyTitle: consultation.property_title,
      propertyLocation: consultation.property_location,
      propertyPrice: consultation.property_price,
      propertyImage: consultation.property_image,
      propertyHref: consultation.property_href,
      sellerEmail: consultation.seller_email,
      sellerName: consultation.seller_name,
      buyerEmail: consultation.buyer_email,
      buyerName: consultation.buyer_name,
      buyerPhone: consultation.buyer_phone,
      status: 'respondido',
      lastMessage: replyText,
      date: formatDate(nowIso),
      messages,
      unreadBySeller: 0,
      unreadByBuyer: (consultation.unread_by_buyer || 0) + 1
    };
  }

  /**
   * Obtener todas las consultas dirigidas a un vendedor
   */
  static async getSellerConsultations(email: string): Promise<IConsultation[]> {
    const cleanEmail = email.toLowerCase().trim();
    const { data: rows, error } = await ConsultationRepository.findBySellerEmail(cleanEmail);
    if (error || !rows) return [];

    return await this.mapConsultationsWithMessages(rows);
  }

  /**
   * Obtener todas las consultas iniciadas por un comprador
   */
  static async getBuyerConsultations(email: string): Promise<IConsultation[]> {
    const cleanEmail = email.toLowerCase().trim();
    const { data: rows, error } = await ConsultationRepository.findByBuyerEmail(cleanEmail);
    if (error || !rows) return [];

    return await this.mapConsultationsWithMessages(rows);
  }

  /**
   * Obtener el detalle de una conversación individual
   */
  static async getConsultationById(consultationId: string): Promise<IConsultation | null> {
    const row = await ConsultationRepository.findById(consultationId);
    if (!row) return null;

    const messages = await this.getMessages(consultationId);

    return {
      id: row.id,
      propertyId: row.property_id,
      propertyTitle: row.property_title,
      propertyLocation: row.property_location,
      propertyPrice: row.property_price,
      propertyImage: row.property_image,
      propertyHref: row.property_href,
      sellerEmail: row.seller_email,
      sellerName: row.seller_name,
      buyerEmail: row.buyer_email,
      buyerName: row.buyer_name,
      buyerPhone: row.buyer_phone,
      status: row.status,
      lastMessage: row.last_message,
      date: formatDate(row.updated_at),
      messages,
      unreadBySeller: row.unread_by_seller ?? 0,
      unreadByBuyer: row.unread_by_buyer ?? 0
    };
  }

  /**
   * Obtener lista de consultas para el panel de administración
   */
  static async getAllConsultations() {
    const { data: rows, error } = await supabase
      .from('consultations')
      .select('*')
      .order('updated_at', { ascending: false });

    if (error || !rows) return [];

    return rows.map((r: any) => ({
      id: r.id,
      propertyId: r.property_id,
      propertyTitle: r.property_title,
      propertyPrice: r.property_price,
      sellerEmail: r.seller_email,
      sellerName: r.seller_name,
      buyerEmail: r.buyer_email,
      buyerName: r.buyer_name,
      buyerPhone: r.buyer_phone,
      status: r.status,
      lastMessage: r.last_message,
      date: formatDate(r.updated_at)
    }));
  }

  private static async getMessages(consultationId: string): Promise<ChatMessageDto[]> {
    const { data: msgRows } = await ConsultationRepository.findMessagesByConsultationIds([consultationId]);
    return (msgRows || []).map((m: any) => ({
      id: m.id,
      senderEmail: m.sender_email,
      senderName: m.sender_name,
      senderRole: m.sender_role,
      text: m.text,
      timestamp: formatDate(m.created_at)
    }));
  }

  private static async mapConsultationsWithMessages(rows: any[]): Promise<IConsultation[]> {
    if (rows.length === 0) return [];
    const ids = rows.map(r => r.id);
    const { data: msgRows } = await ConsultationRepository.findMessagesByConsultationIds(ids);

    const msgsByCons: Record<string, ChatMessageDto[]> = {};
    for (const m of (msgRows || [])) {
      if (!msgsByCons[m.consultation_id]) msgsByCons[m.consultation_id] = [];
      msgsByCons[m.consultation_id].push({
        id: m.id,
        senderEmail: m.sender_email,
        senderName: m.sender_name,
        senderRole: m.sender_role,
        text: m.text,
        timestamp: formatDate(m.created_at)
      });
    }

    return rows.map(r => ({
      id: r.id,
      propertyId: r.property_id,
      propertyTitle: r.property_title,
      propertyLocation: r.property_location,
      propertyPrice: r.property_price,
      propertyImage: r.property_image,
      propertyHref: r.property_href,
      sellerEmail: r.seller_email,
      sellerName: r.seller_name,
      buyerEmail: r.buyer_email,
      buyerName: r.buyer_name,
      buyerPhone: r.buyer_phone,
      status: r.status,
      lastMessage: r.last_message,
      date: formatDate(r.updated_at),
      messages: msgsByCons[r.id] || [],
      unreadBySeller: r.unread_by_seller ?? 0,
      unreadByBuyer: r.unread_by_buyer ?? 0
    }));
  }
}
