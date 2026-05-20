import { CurrencyPipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';

import { Court } from '../../../core/models/court.model';
import { CourtService } from '../../../core/services/court';

@Component({
  selector: 'app-court-list',
  imports: [RouterLink, CurrencyPipe],
  templateUrl: './court-list.html',
  styleUrl: './court-list.scss'
})
export class CourtList {
  private courtService = inject(CourtService);

  courts: Court[] = this.courtService.getCourts();
}