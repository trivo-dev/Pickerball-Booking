import { Injectable } from '@angular/core';
import { User } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUser: User | null = null;

  login(email: string, password: string): boolean {
    if (email === 'admin@gmail.com' && password === '123456') {
      this.currentUser = {
        id: 1,
        fullName: 'Admin',
        email,
        phone: '0900000000',
        role: 'ADMIN'
      };

      return true;
    }

    if (email === 'user@gmail.com' && password === '123456') {
      this.currentUser = {
        id: 2,
        fullName: 'User Demo',
        email,
        phone: '0911111111',
        role: 'USER'
      };

      return true;
    }

    return false;
  }

  logout(): void {
    this.currentUser = null;
  }

  getCurrentUser(): User | null {
    return this.currentUser;
  }

  isLoggedIn(): boolean {
    return this.currentUser !== null;
  }

  isAdmin(): boolean {
    return this.currentUser?.role === 'ADMIN';
  }
}