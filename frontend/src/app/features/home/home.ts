import { Component, inject, OnInit, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { CommonModule, CurrencyPipe } from '@angular/common';

import { AuthService } from '../../core/services/auth';
import { User } from '../../core/models/user.model';
import { CourtService } from '../../core/services/court.service';
import { Court } from '../../core/models/court.model';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterLink, CurrencyPipe],
  templateUrl: './home.html',
  styleUrl: './home.scss'
})
export class Home implements OnInit {
  private authService = inject(AuthService);
  private router = inject(Router);
  private courtService = inject(CourtService);

  user = signal<User | null>(null);
  featuredCourts = signal<Court[]>([]);
  loadingCourts = signal(false);

  ngOnInit(): void {
    this.user.set(this.authService.getCurrentUser());
    this.loadFeaturedCourts();
  }

  loadFeaturedCourts(): void {
    this.loadingCourts.set(true);

    this.courtService.getCourts().subscribe({
      next: (courts) => {
        this.featuredCourts.set((courts || []).slice(0, 4));
        this.loadingCourts.set(false);
      },
      error: (err) => {
        console.error(err);
        this.featuredCourts.set([]);
        this.loadingCourts.set(false);
      }
    });
  }

  logout(): void {
    this.authService.logout();
    this.user.set(null);
    this.router.navigate(['/login']);
  }
}