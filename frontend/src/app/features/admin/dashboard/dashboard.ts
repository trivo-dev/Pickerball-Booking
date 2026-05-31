import {
  ChangeDetectorRef,
  Component,
  ElementRef,
  OnInit,
  ViewChild,
  computed,
  inject,
  signal,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { catchError, forkJoin, of } from 'rxjs';

interface User {
  id: number;
  fullName: string;
  email: string;
  role: string;
}

interface Court {
  id: number;
  name: string;
  location: string;
  pricePerHour: number;
  status: string;
}

interface Booking {
  id: number;
  courtId: number;
  courtName: string;
  customerName: string;
  phone: string;
  bookingDate: string;
  startTime: string;
  endTime: string;
  totalPrice: number;
  status: string;
  userId?: number;
}

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss',
})
export class Dashboard implements OnInit {
  private http = inject(HttpClient);
  private cdr = inject(ChangeDetectorRef);

  @ViewChild('revenueChart') revenueChart!: ElementRef<HTMLCanvasElement>;
  @ViewChild('bookingStatusChart') bookingStatusChart!: ElementRef<HTMLCanvasElement>;
  @ViewChild('courtStatusChart') courtStatusChart!: ElementRef<HTMLCanvasElement>;

  users = signal<User[]>([]);
  courts = signal<Court[]>([]);
  bookings = signal<Booking[]>([]);

  loading = signal(false);

  totalUsers = computed(() => this.users().length);
  totalCourts = computed(() => this.courts().length);
  totalBookings = computed(() => this.bookings().length);

  totalRevenue = computed(() =>
    this.bookings()
      .filter((booking) => booking.status === 'CONFIRMED')
      .reduce((sum, booking) => sum + Number(booking.totalPrice || 0), 0)
  );

  ngOnInit(): void {
    this.loadDashboardData();
  }

  loadDashboardData(): void {
    this.loading.set(true);

    forkJoin({
      users: this.http.get<User[]>('http://localhost:8080/api/admin/users').pipe(
        catchError((err) => {
          console.error('Lỗi lấy users:', err);
          return of([]);
        })
      ),

      courts: this.http.get<Court[]>('http://localhost:8080/api/courts').pipe(
        catchError((err) => {
          console.error('Lỗi lấy courts:', err);
          return of([]);
        })
      ),

      bookings: this.http.get<Booking[]>('http://localhost:8080/api/bookings').pipe(
        catchError((err) => {
          console.error('Lỗi lấy bookings:', err);
          return of([]);
        })
      ),
    }).subscribe({
      next: ({ users, courts, bookings }) => {
        this.users.set(users);
        this.courts.set(courts);
        this.bookings.set(bookings);

        this.loading.set(false);

        this.scheduleDrawCharts();
      },
      error: (err) => {
        console.error('Lỗi dashboard:', err);
        this.loading.set(false);
      },
    });
  }

  scheduleDrawCharts(): void {
    setTimeout(() => {
      this.cdr.detectChanges();

      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          if (
            this.revenueChart?.nativeElement &&
            this.bookingStatusChart?.nativeElement &&
            this.courtStatusChart?.nativeElement
          ) {
            this.drawAllCharts();
          }
        });
      });
    }, 0);
  }

  drawAllCharts(): void {
    this.drawRevenueChart();
    this.drawBookingStatusChart();
    this.drawCourtStatusChart();
  }

 drawRevenueChart(): void {
  const revenueByDate = new Map<string, number>();

  this.bookings()
    .filter((booking) => booking.status === 'CONFIRMED')
    .forEach((booking) => {
      const date = booking.bookingDate;
      const current = revenueByDate.get(date) || 0;

      revenueByDate.set(date, current + Number(booking.totalPrice || 0));
    });

  const labels = Array.from(revenueByDate.keys()).sort();
  const values = labels.map((date) => revenueByDate.get(date) || 0);

  this.drawLineChart(
    this.revenueChart.nativeElement,
    labels,
    values,
    'Doanh thu'
  );
}
  drawBookingStatusChart(): void {
    const labels = ['PENDING', 'CONFIRMED', 'CANCELLED'];

    const values = labels.map((status) =>
      this.bookings().filter((booking) => booking.status === status).length
    );

    this.drawBarChart(
      this.bookingStatusChart.nativeElement,
      labels,
      values,
      'Số lượng'
    );
  }

  drawCourtStatusChart(): void {
    const labels = ['AVAILABLE', 'MAINTENANCE'];

    const values = labels.map((status) =>
      this.courts().filter((court) => court.status === status).length
    );

    this.drawBarChart(
      this.courtStatusChart.nativeElement,
      labels,
      values,
      'Số sân'
    );
  }

  drawBarChart(
    canvas: HTMLCanvasElement,
    labels: string[],
    values: number[],
    title: string
  ): void {
    const ctx = canvas.getContext('2d');

    if (!ctx) {
      return;
    }

    const width = canvas.offsetWidth || 600;
    const height = canvas.offsetHeight || 300;

    canvas.width = width;
    canvas.height = height;

    ctx.clearRect(0, 0, width, height);

    if (labels.length === 0 || values.length === 0) {
      ctx.fillStyle = '#64748b';
      ctx.font = '16px Arial';
      ctx.textAlign = 'center';
      ctx.fillText('Chưa có dữ liệu', width / 2, height / 2);
      return;
    }

    const padding = 45;
    const chartWidth = width - padding * 2;
    const chartHeight = height - padding * 2;

    const maxValue = Math.max(...values, 1);
    const barGap = 18;
    const barWidth = Math.max(chartWidth / values.length - barGap, 25);

    ctx.strokeStyle = '#e2e8f0';
    ctx.lineWidth = 1;

    for (let i = 0; i <= 4; i++) {
      const y = padding + (chartHeight / 4) * i;

      ctx.beginPath();
      ctx.moveTo(padding, y);
      ctx.lineTo(width - padding, y);
      ctx.stroke();
    }

    values.forEach((value, index) => {
      const barHeight = (value / maxValue) * chartHeight;
      const x = padding + index * (barWidth + barGap) + barGap / 2;
      const y = height - padding - barHeight;

      ctx.fillStyle = '#0f766e';
      ctx.fillRect(x, y, barWidth, barHeight);

      ctx.fillStyle = '#0f172a';
      ctx.font = '13px Arial';
      ctx.textAlign = 'center';

      const displayValue =
        value >= 1000000
          ? `${Math.round(value / 1000000)}tr`
          : value >= 1000
            ? `${Math.round(value / 1000)}k`
            : `${value}`;

      ctx.fillText(displayValue, x + barWidth / 2, y - 8);

      ctx.fillStyle = '#475569';
      ctx.font = '12px Arial';

      const label =
        labels[index].length > 14
          ? labels[index].slice(0, 14) + '...'
          : labels[index];

      ctx.fillText(label, x + barWidth / 2, height - 18);
    });

    ctx.fillStyle = '#0f172a';
    ctx.font = 'bold 14px Arial';
    ctx.textAlign = 'left';
    ctx.fillText(title, padding, 22);
  }

drawLineChart(
  canvas: HTMLCanvasElement,
  labels: string[],
  values: number[],
  title: string
): void {
  const ctx = canvas.getContext('2d');

  if (!ctx) {
    return;
  }

  const width = canvas.offsetWidth || 600;
  const height = canvas.offsetHeight || 300;

  canvas.width = width;
  canvas.height = height;

  ctx.clearRect(0, 0, width, height);

  if (labels.length === 0 || values.length === 0) {
    ctx.fillStyle = '#64748b';
    ctx.font = '16px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('Chưa có dữ liệu', width / 2, height / 2);
    return;
  }

  const padding = 50;
  const chartWidth = width - padding * 2;
  const chartHeight = height - padding * 2;

  const maxValue = Math.max(...values, 1);

  // Vẽ lưới ngang
  ctx.strokeStyle = '#e2e8f0';
  ctx.lineWidth = 1;

  for (let i = 0; i <= 4; i++) {
    const y = padding + (chartHeight / 4) * i;

    ctx.beginPath();
    ctx.moveTo(padding, y);
    ctx.lineTo(width - padding, y);
    ctx.stroke();

    const gridValue = Math.round(maxValue - (maxValue / 4) * i);

    ctx.fillStyle = '#64748b';
    ctx.font = '11px Arial';
    ctx.textAlign = 'right';

    const displayGridValue =
      gridValue >= 1000000
        ? `${Math.round(gridValue / 1000000)}tr`
        : gridValue >= 1000
          ? `${Math.round(gridValue / 1000)}k`
          : `${gridValue}`;

    ctx.fillText(displayGridValue, padding - 8, y + 4);
  }

  // Tính tọa độ các điểm
  const points = values.map((value, index) => {
    const x =
      labels.length === 1
        ? padding + chartWidth / 2
        : padding + (chartWidth / (labels.length - 1)) * index;

    const y = height - padding - (value / maxValue) * chartHeight;

    return { x, y, value };
  });

  // Vẽ vùng dưới line
  if (points.length > 0) {
    const gradient = ctx.createLinearGradient(0, padding, 0, height - padding);
    gradient.addColorStop(0, 'rgba(15, 118, 110, 0.25)');
    gradient.addColorStop(1, 'rgba(15, 118, 110, 0.02)');

    ctx.beginPath();
    ctx.moveTo(points[0].x, height - padding);

    points.forEach((point) => {
      ctx.lineTo(point.x, point.y);
    });

    ctx.lineTo(points[points.length - 1].x, height - padding);
    ctx.closePath();

    ctx.fillStyle = gradient;
    ctx.fill();
  }

  // Vẽ đường line
  ctx.beginPath();

  points.forEach((point, index) => {
    if (index === 0) {
      ctx.moveTo(point.x, point.y);
    } else {
      ctx.lineTo(point.x, point.y);
    }
  });

  ctx.strokeStyle = '#0f766e';
  ctx.lineWidth = 3;
  ctx.stroke();

  // Vẽ điểm tròn và giá trị
  points.forEach((point) => {
    ctx.beginPath();
    ctx.arc(point.x, point.y, 5, 0, Math.PI * 2);
    ctx.fillStyle = '#0f766e';
    ctx.fill();

    ctx.beginPath();
    ctx.arc(point.x, point.y, 3, 0, Math.PI * 2);
    ctx.fillStyle = '#ffffff';
    ctx.fill();

    const displayValue =
      point.value >= 1000000
        ? `${Math.round(point.value / 1000000)}tr`
        : point.value >= 1000
          ? `${Math.round(point.value / 1000)}k`
          : `${point.value}`;

    ctx.fillStyle = '#0f172a';
    ctx.font = '13px Arial';
    ctx.textAlign = 'center';
    ctx.fillText(displayValue, point.x, point.y - 12);
  });

  // Vẽ label ngày
  labels.forEach((label, index) => {
    const point = points[index];

    const shortLabel =
      label.length > 10
        ? label.slice(5)
        : label;

    ctx.fillStyle = '#475569';
    ctx.font = '12px Arial';
    ctx.textAlign = 'center';
    ctx.fillText(shortLabel, point.x, height - 18);
  });

  // Tiêu đề trong canvas
  ctx.fillStyle = '#0f172a';
  ctx.font = 'bold 14px Arial';
  ctx.textAlign = 'left';
  ctx.fillText(title, padding, 22);
}

  formatMoney(value: number): string {
    return new Intl.NumberFormat('vi-VN').format(value) + ' VNĐ';
  }

  countBookingByStatus(status: string): number {
    return this.bookings().filter((booking) => booking.status === status).length;
  }

  countCourtByStatus(status: string): number {
    return this.courts().filter((court) => court.status === status).length;
  }
}