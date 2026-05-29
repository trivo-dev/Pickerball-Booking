import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { RouterLink } from '@angular/router';

import { Court } from '../../../core/models/court.model';
import { CourtService } from '../../../core/services/court.service';

@Component({
  selector: 'app-court-list',
  standalone: true,
  imports: [CommonModule, RouterLink, CurrencyPipe],
  templateUrl: './court-list.html',
  styleUrls: ['./court-list.scss']
})
export class CourtList implements OnInit {

  private courtService = inject(CourtService);

  courts = signal<Court[]>([]);
  loading = signal(true);
  error = signal<string | null>(null);

  ngOnInit() {
    this.loadCourts();
  }

  loadCourts() {
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
}