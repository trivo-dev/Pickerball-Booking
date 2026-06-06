import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

import { User } from '../models/user.model';
import { LoginRequest } from '../models/login-request.model';
import { RegisterRequest } from '../models/register-request.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private apiUrl = 'http://localhost:8080/api/auth';

  constructor(private http: HttpClient) {
    // Xóa dữ liệu đăng nhập cũ đang lưu bằng localStorage
    
  }

  login(data: LoginRequest): Observable<User> {
    return this.http.post<User>(`${this.apiUrl}/login`, data);
  }

  register(data: RegisterRequest): Observable<User> {
    return this.http.post<User>(`${this.apiUrl}/register`, data);
  }

  saveUser(user: User): void {
    sessionStorage.setItem('user', JSON.stringify(user));
  }

  getCurrentUser(): User | null {
    const userData = sessionStorage.getItem('user');

    if (!userData) {
      return null;
    }

    return JSON.parse(userData);
  }

  isLoggedIn(): boolean {
    return this.getCurrentUser() !== null;
  }

  isAdmin(): boolean {
    return this.getCurrentUser()?.role === 'ADMIN';
  }

  logout(): void {
    sessionStorage.removeItem('user');
    localStorage.removeItem('user');
  }


  forgotPassword(data: { email: string }) {
  return this.http.post(`${this.apiUrl}/forgot-password`, data, {
    responseType: 'text'
  });
}

resetPassword(data: { email: string; pin: string; newPassword: string }) {
  return this.http.post(`${this.apiUrl}/reset-password`, data, {
    responseType: 'text'
  });
}

verifyResetPin(data: { email: string; pin: string }) {
  return this.http.post(`${this.apiUrl}/verify-reset-pin`, data, {
    responseType: 'text'
  });
}
}