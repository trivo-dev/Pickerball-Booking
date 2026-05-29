export interface Booking {
  id: number;
  courtId: number;
  courtName: string;
  customerName: string;
  phone: string;
  bookingDate: string;
  startTime: string;
  endTime: string;
  totalPrice: number;
  status: 'PENDING' | 'CONFIRMED' | 'CANCELLED';
  userId?: number;
}
