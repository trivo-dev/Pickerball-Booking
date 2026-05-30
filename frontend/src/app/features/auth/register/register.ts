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
  styleUrl: './register.scss'
})
export class Register {

  registerData: RegisterRequest = {
    fullName: '',
    email: '',
    password: '',
    phone: ''
  };

  confirmPassword = '';

  errorMessage = '';
  successMessage = '';

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  onRegister(): void {
    this.errorMessage = '';
    this.successMessage = '';

    if (
      !this.registerData.fullName ||
      !this.registerData.email ||
      !this.registerData.password ||
      !this.registerData.phone
    ) {
      this.errorMessage = 'Vui lòng nhập đầy đủ thông tin';
      return;
    }

    if (this.registerData.password !== this.confirmPassword) {
      this.errorMessage = 'Mật khẩu xác nhận không khớp';
      return;
    }

    this.authService.register(this.registerData).subscribe({
      next: (res) => {
        this.successMessage = res.message ?? 'Đăng ký thành công';

        setTimeout(() => {
          this.router.navigate(['/login']);
        }, 1000);
      },
      error: (err) => {
        this.errorMessage = err.error || 'Đăng ký thất bại';
      }
    });
  }
}