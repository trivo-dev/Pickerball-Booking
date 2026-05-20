import { Injectable } from '@angular/core';
import { Booking } from '../models/booking.model';

@Injectable({
  providedIn: 'root'
})
export class BookingService {
  private bookings: Booking[] = [
    {
      id: 1,
      courtId: 1,
      courtName: 'Sân Pickleball Quận 1',
      customerName: 'Nguyễn Văn A',
      phone: '0909123456',
      bookingDate: '2026-05-20',
      startTime: '18:00',
      endTime: '19:00',
      totalPrice: 120000,
      status: 'CONFIRMED'
    }
  ];

  getBookings(): Booking[] {
    return this.bookings;
  }

  addBooking(booking: Booking): void {
    this.bookings.push({
      ...booking,
      id: this.bookings.length + 1,
      status: 'PENDING'
    });
  }

  cancelBooking(id: number): void {
    const booking = this.bookings.find(item => item.id === id);

    if (booking) {
      booking.status = 'CANCELLED';
    }
  }

  confirmBooking(id: number): void {
    const booking = this.bookings.find(item => item.id === id);

    if (booking) {
      booking.status = 'CONFIRMED';
    }
  }
}