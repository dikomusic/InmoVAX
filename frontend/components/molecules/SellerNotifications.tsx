import React from 'react';
import { Bell, CalendarDays, CircleDollarSign, Scale } from 'lucide-react';

export interface SellerNotificationItem {
  id: string;
  title: string;
  detail: string;
  time: string;
  type: 'offer' | 'appointment' | 'legal' | 'general';
}

interface SellerNotificationsProps {
  pendingOffersCount: number;
  notifications?: SellerNotificationItem[];
}

function getNotificationVisuals(type: SellerNotificationItem['type']) {
  switch (type) {
    case 'offer':
      return {
        Icon: CircleDollarSign,
        color: 'text-emerald-600 bg-emerald-50'
      };
    case 'appointment':
      return {
        Icon: CalendarDays,
        color: 'text-blue-600 bg-blue-50'
      };
    case 'legal':
      return {
        Icon: Scale,
        color: 'text-amber-600 bg-amber-50'
      };
    default:
      return {
        Icon: Bell,
        color: 'text-indigo-600 bg-indigo-50'
      };
  }
}

export const SellerNotifications = ({
  pendingOffersCount,
  notifications = []
}: SellerNotificationsProps) => {
  if (!notifications || notifications.length === 0) {
    return null;
  }

  return (
    <section className="rounded-3xl border border-gray-100 bg-white p-5 shadow-sm sm:p-6" aria-labelledby="seller-notifications-title">
      <div className="mb-4 flex items-start justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Bell aria-hidden="true" className="h-5 w-5 text-primary" />
            <h3 id="seller-notifications-title" className="font-extrabold text-surface-dark">Actividad reciente</h3>
          </div>
          <p className="mt-1 text-xs text-content-muted">Actualizaciones en tiempo real desde Supabase DDRR.</p>
        </div>
        <span className="shrink-0 rounded-full bg-emerald-100 px-2.5 py-1 text-[10px] font-black text-emerald-800">
          {pendingOffersCount} pendientes
        </span>
      </div>

      <div className="grid gap-3 md:grid-cols-3">
        {notifications.map((item) => {
          const { Icon, color } = getNotificationVisuals(item.type);
          return (
            <article key={item.id} className="flex gap-3 rounded-2xl border border-gray-100 bg-gray-50 p-3 hover:bg-slate-50 transition-colors">
              <span className={`grid h-9 w-9 shrink-0 place-items-center rounded-xl ${color}`}>
                <Icon aria-hidden="true" className="h-4 w-4" />
              </span>
              <div className="min-w-0">
                <h4 className="truncate text-xs font-extrabold text-surface-dark">{item.title}</h4>
                <p className="mt-1 line-clamp-2 text-[11px] text-content-muted">{item.detail}</p>
                <time className="mt-1 block text-[10px] text-gray-400">{item.time}</time>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
};