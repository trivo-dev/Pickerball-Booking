import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { Booking } from '../models/booking.model';

@Injectable({
  providedIn: 'root'
})
export class BookingService {
  private http = inject(HttpClient);
  private apiUrl = 'http://localhost:8080/api/bookings';

  getBookings(userId?: number): Observable<Booking[]> {
    const url = userId ? `${this.apiUrl}?userId=${userId}` : this.apiUrl;
    return this.http.get<Booking[]>(url);
  }

  addBooking(booking: Omit<Booking, 'id' | 'status'> & { userId?: number }): Observable<Booking> {
    return this.http.post<Booking>(this.apiUrl, booking);
  }

  cancelBooking(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  confirmBooking(id: number): Observable<Booking> {
    return this.http.put<Booking>(`${this.apiUrl}/${id}/confirm`, {});
  }
}
