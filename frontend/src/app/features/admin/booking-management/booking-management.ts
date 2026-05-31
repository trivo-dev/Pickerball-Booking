import { CommonModule } from '@angular/common';
import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { Booking } from '../../../core/models/booking.model';
import { BookingService } from '../../../core/services/booking';

@Component({
  selector: 'app-booking-management',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './booking-management.html',
  styleUrl: './booking-management.scss',
})
export class BookingManagement implements OnInit {
  private bookingService = inject(BookingService);

  bookings = signal<Booking[]>([]);
  loading = signal(false);

  searchText = signal('');
  statusFilter = signal('ALL');

  confirmingId = signal<number | null>(null);
  deletingId = signal<number | null>(null);

  totalBookings = computed(() => this.bookings().length);

  pendingBookings = computed(() =>
    this.bookings().filter((booking) => booking.status === 'PENDING').length
  );

  confirmedBookings = computed(() =>
    this.bookings().filter((booking) => booking.status === 'CONFIRMED').length
  );

  cancelledBookings = computed(() =>
    this.bookings().filter((booking) => booking.status === 'CANCELLED').length
  );

  totalRevenue = computed(() =>
    this.bookings()
      .filter((booking) => booking.status === 'CONFIRMED')
      .reduce((total, booking) => total + Number(booking.totalPrice || 0), 0)
  );

  filteredBookings = computed(() => {
    const keyword = this.searchText().toLowerCase().trim();
    const status = this.statusFilter();

    return this.bookings().filter((booking) => {
      const matchSearch =
        booking.customerName.toLowerCase().includes(keyword) ||
        booking.phone.includes(keyword) ||
        booking.courtName.toLowerCase().includes(keyword);

      const matchStatus = status === 'ALL' || booking.status === status;

      return matchSearch && matchStatus;
    });
  });

  ngOnInit(): void {
    this.loadBookings();
  }

  loadBookings(): void {
    this.loading.set(true);

    this.bookingService.getBookings().subscribe({
      next: (data) => {
        this.bookings.set(data);
        this.loading.set(false);
      },
      error: (err) => {
        console.error('Lỗi lấy danh sách lịch đặt:', err);
        this.loading.set(false);
      },
    });
  }

  confirmBooking(id: number): void {
    if (this.confirmingId() !== null) {
      return;
    }

    if (!confirm('Bạn có chắc muốn xác nhận lịch đặt này không?')) {
      return;
    }

    this.confirmingId.set(id);

    this.bookingService.confirmBooking(id).subscribe({
      next: () => {
        alert('Xác nhận lịch đặt thành công');
        this.loadBookings();
        this.confirmingId.set(null);
      },
      error: (err) => {
        console.error('Lỗi xác nhận lịch đặt:', err);
        alert('Xác nhận lịch đặt thất bại');
        this.confirmingId.set(null);
      },
    });
  }

  deleteBooking(id: number): void {
    if (this.deletingId() !== null) {
      return;
    }

    if (!confirm('Bạn có chắc muốn xóa lịch đặt này không?')) {
      return;
    }

    this.deletingId.set(id);

    this.bookingService.cancelBooking(id).subscribe({
      next: () => {
        alert('Xóa lịch đặt thành công');
        this.loadBookings();
        this.deletingId.set(null);
      },
      error: (err) => {
        console.error('Lỗi xóa lịch đặt:', err);
        alert('Xóa lịch đặt thất bại');
        this.deletingId.set(null);
      },
    });
  }

  updateSearchText(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.searchText.set(input.value);
  }

  updateStatusFilter(event: Event): void {
    const select = event.target as HTMLSelectElement;
    this.statusFilter.set(select.value);
  }

  getStatusLabel(status: string): string {
    switch (status) {
      case 'PENDING':
        return 'Chờ xác nhận';
      case 'CONFIRMED':
        return 'Đã xác nhận';
      case 'CANCELLED':
        return 'Đã hủy';
      default:
        return status;
    }
  }

  formatMoney(value: number): string {
    return new Intl.NumberFormat('vi-VN').format(value) + ' VNĐ';
  }
}