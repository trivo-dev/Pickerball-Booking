import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';

import { Court } from '../../../core/models/court.model';
import { CourtService } from '../../../core/services/court.service';
import { AuthService } from '../../../core/services/auth';

@Component({
  selector: 'app-court-detail',
  standalone: true,
  imports: [CommonModule, RouterLink, CurrencyPipe],
  templateUrl: './court-detail.html',
  styleUrl: './court-detail.scss'
})
export class CourtDetail implements OnInit {

  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private courtService = inject(CourtService);
  private authService = inject(AuthService);

  court = signal<Court | null>(null);

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));

    this.courtService.getCourtById(id).subscribe({
      next: (data) => {
        this.court.set(data);
      },
      error: (err) => {
        console.error(err);
      }
    });
  }

  bookCourt(courtId: number): void {
    if (!this.authService.isLoggedIn()) {
      this.router.navigate(['/login']);
      return;
    }

    this.router.navigate(['/booking', courtId]);
  }
}