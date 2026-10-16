/**
 * Repositorio de Consultas P2P y Mensajería (Capa de Acceso a Datos - DAL)
 * InmoVAX Backend - Patrón Repositorio
 */

import { supabase } from '../config/supabase';
import { IConsultation, ChatMessageDto } from '../interfaces/consultation.interface';

export class ConsultationRepository {
  /**
   * Resolver identificador de propiedad en Supabase
   */
  static async resolvePropertyUuid(rawIdOrCode?: string): Promise<{ id: string; code?: string; inquiries_count?: number } | null> {
    if (!rawIdOrCode) return null;
    const decoded = decodeURIComponent(rawIdOrCode).trim();
    const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(decoded);

    try {
      let query = supabase.from('properties').select('id, code, inquiries_count');
      if (isUuid) {
        query = query.eq('id', decoded);
      } else {
        query = query.ilike('code', decoded);
      }
      const { data } = await query.maybeSingle();
      return data || null;
    } catch {
      return null;
    }
  }

  /**
   * Buscar consultas dirigidas a un vendedor
   */
  static async findBySellerEmail(sellerEmail: string) {
    const cleanEmail = sellerEmail.toLowerCase().trim();
    return await supabase
      .from('consultations')
      .select('*')
      .ilike('seller_email', cleanEmail)
      .order('updated_at', { ascending: false });
  }

  /**
   * Buscar consultas realizadas por un comprador
   */
  static async findByBuyerEmail(buyerEmail: string) {
    const cleanEmail = buyerEmail.toLowerCase().trim();
    return await supabase
      .from('consultations')
      .select('*')
      .ilike('buyer_email', cleanEmail)
      .order('updated_at', { ascending: false });
  }

  /**
   * Buscar mensajes asociados a una lista de IDs de consultas
   */
  static async findMessagesByConsultationIds(consultationIds: string[]) {
    if (consultationIds.length === 0) return { data: [], error: null };
    return await supabase
      .from('consultation_messages')
      .select('*')
      .in('consultation_id', consultationIds)
      .order('created_at', { ascending: true });
  }

  /**
   * Crear o registrar una nueva consulta
   */
  static async createConsultation(payload: Record<string, any>) {
    return await supabase
      .from('consultations')
      .insert(payload)
      .select()
      .single();
  }

  /**
   * Insertar un mensaje dentro de una conversación
   */
  static async createMessage(payload: Record<string, any>) {
    return await supabase
      .from('consultation_messages')
      .insert(payload)
      .select()
      .single();
  }

  /**
   * Actualizar estado y fecha de última interacción en la consulta
   */
  static async updateConsultation(consultationId: string, updates: Record<string, any>) {
    return await supabase
      .from('consultations')
      .update(updates)
      .eq('id', consultationId);
  }

  /**
   * Buscar consulta por su ID primario
   */
  static async findById(consultationId: string) {
    const { data, error } = await supabase
      .from('consultations')
      .select('*')
      .eq('id', consultationId)
      .maybeSingle();

    if (error || !data) return null;
    return data;
  }
}
