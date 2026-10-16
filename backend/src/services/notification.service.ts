import { NotificationRepository } from '../repositories/notification.repository';
import { SellerNotificationItem } from '../interfaces/notification.interface';

export class NotificationService {
  private static timeAgo(dateString?: string): string {
    if (!dateString) return 'Reciente';
    const now = new Date();
    const date = new Date(dateString);
    const diffMs = now.getTime() - date.getTime();
    const diffSec = Math.floor(diffMs / 1000);
    const diffMin = Math.floor(diffSec / 60);
    const diffHours = Math.floor(diffMin / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMin < 1) return 'Hace un momento';
    if (diffMin < 60) return `Hace ${diffMin} min`;
    if (diffHours < 24) return `Hace ${diffHours} ${diffHours === 1 ? 'hora' : 'horas'}`;
    if (diffDays === 1) return 'Ayer';
    if (diffDays < 7) return `Hace ${diffDays} días`;
    return date.toLocaleDateString('es-BO', { month: 'short', day: 'numeric' });
  }

  static async getRecentNotifications(): Promise<SellerNotificationItem[]> {
    const notifications: SellerNotificationItem[] = [];

    try {
      // 1. Últimas ofertas
      const { data: offers } = await NotificationRepository.getRecentOffers(2);
      if (offers) {
        for (const off of offers as any[]) {
          const propTitle = off.properties?.title || 'Inmueble';
          const pricePrefix = off.currency === 'USD' ? '$us ' : 'Bs. ';
          notifications.push({
            id: `notif-ofr-${off.id}`,
            title: 'Nueva oferta recibida',
            detail: `${propTitle} · ${pricePrefix}${Number(off.offer_amount).toLocaleString()}`,
            time: NotificationService.timeAgo(off.created_at),
            type: 'offer',
          });
        }
      }

      // 2. Últimas citas
      const { data: appointments } = await NotificationRepository.getRecentAppointments(2);
      if (appointments) {
        for (const apt of appointments as any[]) {
          const propTitle = apt.properties?.title || 'Inmueble';
          const advisorName = apt.advisors?.full_name || 'Asesor InmoVAX';
          notifications.push({
            id: `notif-apt-${apt.id}`,
            title: 'Visita guiada agendada',
            detail: `${apt.time_slot} hrs con ${advisorName} (${propTitle})`,
            time: NotificationService.timeAgo(apt.created_at),
            type: 'appointment',
          });
        }
      }

      // 3. Últimas auditorías legales DDRR
      const { data: audits } = await NotificationRepository.getRecentAudits(2);
      if (audits) {
        for (const aud of audits as any[]) {
          notifications.push({
            id: `notif-aud-${aud.id}`,
            title: 'Folio Real auditado DDRR',
            detail: `Matrícula ${aud.folio_real} · ${aud.alodial_status} (${aud.verified_by})`,
            time: NotificationService.timeAgo(aud.created_at),
            type: 'legal',
          });
        }
      }
    } catch (err) {
      console.error('Error compiling notifications from Supabase:', err);
    }

    if (notifications.length === 0) {
      notifications.push(
        {
          id: 'notif-def-1',
          title: 'Verificación Legal InmoVAX',
          detail: 'Tus inmuebles cuentan con protección legal y folio alodial verificado.',
          time: 'Hoy',
          type: 'legal',
        },
        {
          id: 'notif-def-2',
          title: 'Asesoría Inmobiliaria Activa',
          detail: 'Asesores certificados de La Paz listos para acompañar visitas.',
          time: 'Hoy',
          type: 'appointment',
        }
      );
    }

    return notifications;
  }
}
