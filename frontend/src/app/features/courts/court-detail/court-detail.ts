import { Component, inject } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { ActivatedRoute } from '@angular/router';

import { map, switchMap } from 'rxjs/operators';
import { toSignal } from '@angular/core/rxjs-interop';

import { CourtService } from '../../../core/services/court.service';

@Component({
  selector: 'app-court-detail',
  standalone: true,
  imports: [CommonModule, CurrencyPipe],
  templateUrl: './court-detail.html',
  styleUrls: ['./court-detail.scss']
})
export class CourtDetail {

  private route = inject(ActivatedRoute);
  private courtService = inject(CourtService);

  court = toSignal(
    this.route.paramMap.pipe(

      map(params => Number(params.get('id'))),

      switchMap(id =>
        this.courtService.getCourtById(id)
      )

    ),
    {
      initialValue: null
    }
  );

}