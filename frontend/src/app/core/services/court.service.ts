import { inject, Injectable } from '@angular/core';
import { Court } from '../models/court.model';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CourtService {

  private http = inject(HttpClient);

  private apiUrl = 'http://localhost:8080/api/courts';

  getCourts(): Observable<Court[]> {
    return this.http.get<Court[]>(this.apiUrl);
  }

  getCourtById(id: number): Observable<Court> {
    return this.http.get<Court>(
      `${this.apiUrl}/${id}`
    );
  }
}