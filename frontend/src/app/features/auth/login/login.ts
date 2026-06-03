import { Component, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

import { AuthService } from '../../../core/services/auth';
import { LoginRequest } from '../../../core/models/login-request.model';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './login.html',
  styleUrl: './login.scss'
})
export class Login {

  loginData: LoginRequest = {
    email: '',
    password: ''
  };

  errorMessage = signal('');
  successMessage = signal('');

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  onLogin(): void {
    this.errorMessage.set('');
    this.successMessage.set('');

    if (!this.loginData.email.trim()) {
      this.errorMessage.set('Vui lòng nhập email');
      return;
    }

    if (!this.loginData.password.trim()) {
      this.errorMessage.set('Vui lòng nhập mật khẩu');
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(this.loginData.email)) {
      this.errorMessage.set('Email không đúng định dạng');
      return;
    }

    this.authService.login(this.loginData).subscribe({
      next: (res) => {
        this.authService.saveUser(res);

        this.successMessage.set(res.message ?? 'Đăng nhập thành công');

        this.router.navigate(['/home']);
      },
      error: (err) => {
        if (typeof err.error === 'string') {
          this.errorMessage.set(err.error);
        } else {
          this.errorMessage.set('Email hoặc mật khẩu không đúng');
        }
      }
    });
  }
}