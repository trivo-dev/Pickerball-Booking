import { Component, inject, OnInit, signal, computed } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { Router, RouterLink } from '@angular/router';

import { Court } from '../../../core/models/court.model';
import { CourtService } from '../../../core/services/court.service';
import { AuthService } from '../../../core/services/auth';

@Component({
  selector: 'app-court-list',
  standalone: true,
  imports: [CommonModule, RouterLink, CurrencyPipe],
  templateUrl: './court-list.html',
  styleUrls: ['./court-list.scss']
})
export class CourtList implements OnInit {

  private courtService = inject(CourtService);
  private authService = inject(AuthService);
  private router = inject(Router);

  courts = signal<Court[]>([]);
  loading = signal(true);
  error = signal<string | null>(null);

  searchInput = signal('');
  priceInput = signal<number | null>(null);

  appliedSearch = signal('');
  appliedPrice = signal<number | null>(null);

  filteredCourts = computed(() => {
    const keyword = this.appliedSearch().trim().toLowerCase();
    const maxPrice = this.appliedPrice();

    return this.courts().filter(court => {
      const matchText =
        !keyword ||
        court.name.toLowerCase().includes(keyword) ||
        court.location.toLowerCase().includes(keyword);

      const matchPrice =
        maxPrice === null ||
        court.pricePerHour <= maxPrice;

      return matchText && matchPrice;
    });
  });

  ngOnInit(): void {
    this.loadCourts();
  }

  loadCourts(): void {
    this.loading.set(true);
    this.error.set(null);

    this.courtService.getCourts().subscribe({
      next: (data) => {
        this.courts.set(data || []);
        this.loading.set(false);
      },
      error: (err) => {
        console.error(err);
        this.error.set('Không thể tải danh sách sân');
        this.loading.set(false);
      }
    });
  }

  onSearchTextChange(event: Event): void {
    const value = (event.target as HTMLInputElement).value;
    this.searchInput.set(value);
  }

  onPriceChange(event: Event): void {
    const value = (event.target as HTMLInputElement).value;
    this.priceInput.set(value ? Number(value) : null);
  }

  searchCourts(): void {
    this.appliedSearch.set(this.searchInput());
    this.appliedPrice.set(this.priceInput());
  }

  clearSearch(): void {
    this.searchInput.set('');
    this.priceInput.set(null);
    this.appliedSearch.set('');
    this.appliedPrice.set(null);
  }

  bookCourt(courtId: number): void {
    if (!this.authService.isLoggedIn()) {
      this.router.navigate(['/login']);
      return;
    }

    this.router.navigate(['/booking', courtId]);
  }
}