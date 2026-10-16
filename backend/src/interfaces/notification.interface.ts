export interface SellerNotificationItem {
  id: string;
  title: string;
  detail: string;
  time: string;
  type: 'offer' | 'appointment' | 'legal' | 'general';
}
