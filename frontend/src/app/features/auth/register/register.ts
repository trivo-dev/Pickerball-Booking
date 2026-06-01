import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

import { AuthService } from '../../../core/services/auth';
import { RegisterRequest } from '../../../core/models/register-request.model';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './register.html',
  styleUrl: './register.scss',
})
export class Register {
  registerData: RegisterRequest = {
    fullName: '',
    email: '',
    password: '',
    phone: '',
  };

  confirmPassword = '';

  errorMessage = '';
  successMessage = '';

  constructor(
    private authService: AuthService,
    private router: Router,
  ) {}

  onRegister(): void {
    this.errorMessage = '';
    this.successMessage = '';

    const fullName = this.registerData.fullName.trim();
    const email = this.registerData.email.trim();
    const password = this.registerData.password.trim();
    const phone = this.registerData.phone.trim();

    if (!fullName || !email || !password || !phone) {
      this.errorMessage = 'Vui lòng nhập đầy đủ thông tin';
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(email)) {
      this.errorMessage = 'Email không đúng định dạng';
      return;
    }

    if (password !== this.confirmPassword.trim()) {
      this.errorMessage = 'Mật khẩu xác nhận không khớp';
      return;
    }

    this.registerData = {
      fullName,
      email,
      password,
      phone,
    };

    this.authService.register(this.registerData).subscribe({
      next: (res) => {
        this.successMessage = res.message ?? 'Đăng ký thành công';

        setTimeout(() => {
          this.router.navigate(['/login']);
        }, 1000);
      },
      error: (err) => {
        this.errorMessage = err.error || 'Đăng ký thất bại';
      },
    });
  }
}
