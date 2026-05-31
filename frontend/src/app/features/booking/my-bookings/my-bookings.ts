import { Component, inject, signal } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { ActivatedRoute } from '@angular/router';

import { BookingService } from '../../../core/services/booking';
import { AuthService } from '../../../core/services/auth';
import { Booking } from '../../../core/models/booking.model';

@Component({
  selector: 'app-my-bookings',
  standalone: true,
  imports: [CommonModule, CurrencyPipe],
  templateUrl: './my-bookings.html',
  styleUrls: ['./my-bookings.scss'],
})
export class MyBookings {
  private bookingService = inject(BookingService);
  private authService = inject(AuthService);
  private route = inject(ActivatedRoute);

  bookings = signal<Booking[] | null>(null);
  loading = signal(true);
  message = signal<string | null>(null);

  constructor() {
    if (this.route.snapshot.queryParamMap.get('success') === 'true') {
      this.message.set('Đặt sân thành công!');
    }

    this.loadBookings();
  }

  loadBookings(): void {
    this.bookings.set(null);
    this.loading.set(true);

    const userId = this.authService.getCurrentUser()?.id;

    const bookingObservable = userId
      ? this.bookingService.getBookings(userId)
      : this.bookingService.getBookings();

    bookingObservable.subscribe({
      next: (bookings) => {
        this.bookings.set(bookings);
        this.loading.set(false);
      },
      error: () => {
        this.message.set(
          'Không thể tải danh sách đặt sân. Vui lòng thử lại.'
        );
        this.bookings.set([]);
        this.loading.set(false);
      },
    });
  }

  cancelBooking(id: number): void {
    this.bookingService.cancelBooking(id).subscribe({
      next: () => {
        this.message.set(
          'Yêu cầu hủy đã được gửi. Tình trạng sẽ cập nhật.'
        );
        this.loadBookings();
      },
      error: () => {
        this.message.set(
          'Hủy đặt sân thất bại. Vui lòng thử lại.'
        );
      },
    });
  }
}