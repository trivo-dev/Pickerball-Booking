import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { ChangePasswordRequest } from '../models/change-password-request.model';

import { User } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private apiUrl = 'http://localhost:8080/api/admin/users';

  constructor(private http: HttpClient) { }

  getAllUsers(keyword: string = ''): Observable<User[]> {
    if (keyword.trim()) {
      return this.http.get<User[]>(
        `${this.apiUrl}?keyword=${encodeURIComponent(keyword)}`
      );
    }

    return this.http.get<User[]>(this.apiUrl);
  }

  updateUserRole(id: number, role: string): Observable<User> {
    return this.http.put<User>(`${this.apiUrl}/${id}/role`, { role });
  }

  deleteUser(id: number): Observable<string> {
    return this.http.delete(`${this.apiUrl}/${id}`, {
      responseType: 'text'
    });
  }
  changePassword(userId: number, data: ChangePasswordRequest): Observable<string> {
    return this.http.put(`${this.apiUrl}/${userId}/change-password`, data, {
      responseType: 'text'
    });
  }
}