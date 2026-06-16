import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { map, switchMap } from 'rxjs/operators';
import { toSignal } from '@angular/core/rxjs-interop';

import { BookingService } from '../../../core/services/booking';
import { CourtService } from '../../../core/services/court.service';
import { AuthService } from '../../../core/services/auth';
import { Booking } from '../../../core/models/booking.model';

@Component({
  selector: 'app-booking-form',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './booking-form.html',
  styleUrls: ['./booking-form.scss'],
})
export class BookingForm {
  private route = inject(ActivatedRoute);
  private courtService = inject(CourtService);
  private bookingService = inject(BookingService);
  private authService = inject(AuthService);
  private router = inject(Router);

  court = toSignal(
    this.route.paramMap.pipe(
      map((params) => Number(params.get('courtId'))),
      switchMap((id) => this.courtService.getCourtById(id)),
    ),
    {
      initialValue: null,
    },
  );

  customerName = '';
  phone = '';
  bookingDate = new Date().toISOString().slice(0, 10);
  startTime = '18:00';
  endTime = '19:00';
  message: string | null = null;

  get totalPrice(): number {
    const court = this.court();
    if (!court) {
      return 0;
    }

    const duration = this.getDurationMinutes(this.startTime, this.endTime);
    const hours = duration / 60;

    return Math.max(0, Math.round(hours * court.pricePerHour));
  }

  get canSubmit(): boolean {
    return (
      !!this.customerName.trim() &&
      !!this.phone.trim() &&
      !!this.bookingDate &&
      !!this.startTime &&
      !!this.endTime &&
      this.totalPrice > 0 &&
      !!this.court()
    );
  }

  getDurationMinutes(start: string, end: string): number {
    const [startHour, startMinute] = start.split(':').map(Number);
    const [endHour, endMinute] = end.split(':').map(Number);
    return endHour * 60 + endMinute - (startHour * 60 + startMinute);
  }

  submitBooking(): void {
    if (!this.authService.isLoggedIn()) {
      this.router.navigate(['/login'], {
        queryParams: { returnUrl: this.router.url },
      });
      return;
    }

    const court = this.court();
    if (!court) {
      return;
    }

    if (this.getDurationMinutes(this.startTime, this.endTime) <= 0) {
      this.message = 'Thời gian kết thúc phải lớn hơn thời gian bắt đầu.';
      return;
    }

    // Kiểm tra xem khung giờ có trùng không
    this.bookingService
      .checkAvailability(court.id, this.bookingDate, this.startTime, this.endTime)
      .subscribe({
        next: (isAvailable) => {
          if (!isAvailable) {
            this.message = 'Khung giờ này đã được đặt. Vui lòng chọn khung giờ khác.';
            return;
          }

          // Tiếp tục đặt sân nếu không trùng lịch
          this.proceedWithBooking();
        },
        error: () => {
          this.message = 'Lỗi kiểm tra tính khả dụng. Vui lòng thử lại.';
        },
      });
  }

  private proceedWithBooking(): void {
    const court = this.court();
    if (!court) {
      return;
    }

    const userId = this.authService.getCurrentUser()?.id;

    const booking: Omit<Booking, 'id' | 'status'> & { userId?: number } = {
      courtId: court.id,
      courtName: court.name,
      customerName: this.customerName.trim(),
      phone: this.phone.trim(),
      bookingDate: this.bookingDate,
      startTime: this.startTime,
      endTime: this.endTime,
      totalPrice: this.totalPrice,
      userId,
    };

    this.bookingService.addBooking(booking).subscribe({
      next: () => {
        this.router.navigate(['/my-bookings'], {
          queryParams: { success: 'true' },
        });
      },
      error: () => {
        this.message = 'Lưu đặt sân thất bại. Vui lòng thử lại.';
      },
    });
  }
}
