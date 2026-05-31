import { CommonModule } from '@angular/common';
import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { Court } from '../../../core/models/court.model';
import { CourtService } from '../../../core/services/court.service';

@Component({
  selector: 'app-court-management',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './court-management.html',
  styleUrl: './court-management.scss',
})
export class CourtManagement implements OnInit {
  private courtService = inject(CourtService);

  courts = signal<Court[]>([]);
  loading = signal(false);

  isEdit = signal(false);
  editingId = signal<number | null>(null);
  deletingId = signal<number | null>(null);

  searchText = signal('');
  statusFilter = signal('ALL');

  formData: Court = {
    id: 0,
    name: '',
    location: '',
    pricePerHour: 0,
    imageUrl: '',
    description: '',
    status: 'AVAILABLE',
  };

  totalCourts = computed(() => this.courts().length);

  availableCourts = computed(() =>
    this.courts().filter((court) => court.status === 'AVAILABLE').length
  );

  maintenanceCourts = computed(() =>
    this.courts().filter((court) => court.status === 'MAINTENANCE').length
  );

  filteredCourts = computed(() => {
    const keyword = this.searchText().toLowerCase().trim();
    const status = this.statusFilter();

    return this.courts().filter((court) => {
      const matchSearch =
        court.name.toLowerCase().includes(keyword) ||
        court.location.toLowerCase().includes(keyword);

      const matchStatus = status === 'ALL' || court.status === status;

      return matchSearch && matchStatus;
    });
  });

  ngOnInit(): void {
    this.loadCourts();
  }

  loadCourts(): void {
    this.loading.set(true);

    this.courtService.getCourts().subscribe({
      next: (data) => {
        this.courts.set(data);
        this.loading.set(false);
      },
      error: (err) => {
        console.error('Lỗi lấy danh sách sân:', err);
        this.loading.set(false);
      },
    });
  }

  saveCourt(): void {
    if (this.isEdit() && this.editingId()) {
      this.courtService.updateCourt(this.editingId()!, this.formData).subscribe({
        next: () => {
          alert('Cập nhật sân thành công');
          this.loadCourts();
          this.resetForm();
        },
        error: (err) => {
          console.error('Lỗi cập nhật sân:', err);
          alert('Cập nhật sân thất bại');
        },
      });

      return;
    }

    const { id, ...newCourt } = this.formData;

    this.courtService.createCourt(newCourt).subscribe({
      next: () => {
        alert('Thêm sân thành công');
        this.loadCourts();
        this.resetForm();
      },
      error: (err) => {
        console.error('Lỗi thêm sân:', err);
        alert('Thêm sân thất bại');
      },
    });
  }

  editCourt(court: Court): void {
    this.isEdit.set(true);
    this.editingId.set(court.id);
    this.formData = { ...court };

    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  }

  deleteCourt(id: number): void {
    if (this.deletingId() !== null) {
      return;
    }

    if (!confirm('Bạn có chắc muốn xóa sân này không?')) {
      return;
    }

    this.deletingId.set(id);

    this.courtService.deleteCourt(id).subscribe({
      next: () => {
        alert('Xóa sân thành công');
        this.loadCourts();
        this.deletingId.set(null);
      },
      error: (err) => {
        console.error('Lỗi xóa sân:', err);
        alert('Xóa sân thất bại');
        this.deletingId.set(null);
      },
    });
  }

  resetForm(): void {
    this.isEdit.set(false);
    this.editingId.set(null);

    this.formData = {
      id: 0,
      name: '',
      location: '',
      pricePerHour: 0,
      imageUrl: '',
      description: '',
      status: 'AVAILABLE',
    };
  }

  updateSearchText(event: Event): void {
    const input = event.target as HTMLInputElement;
    this.searchText.set(input.value);
  }

  updateStatusFilter(event: Event): void {
    const select = event.target as HTMLSelectElement;
    this.statusFilter.set(select.value);
  }
}