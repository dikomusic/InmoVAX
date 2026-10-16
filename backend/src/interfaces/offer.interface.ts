export interface OfferItem {
  id: string;
  code: string;
  propertyTitle: string;
  buyerName: string;
  buyerPhone: string;
  offerAmount: string;
  initialPrice: string;
  date: string;
  message: string;
  status: string;
  type: 'Anticrético' | 'Venta' | 'Alquiler';
}

export interface CounterOfferDTO {
  counterPrice: string;
}
