import { Component } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

import { AuthService } from '../../../core/services/auth';
import { LoginRequest } from '../../../core/models/login-request.model';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './login.html',
  styleUrl: './login.scss',
})
export class Login {
  loginData: LoginRequest = {
    email: '',
    password: '',
  };

  errorMessage = '';
  successMessage = '';

  private returnUrl = '/';

  constructor(
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute,
  ) {
    const returnUrl = this.route.snapshot.queryParamMap.get('returnUrl');
    if (returnUrl) {
      this.returnUrl = returnUrl;
    }
  }

  onLogin(): void {
    this.errorMessage = '';
    this.successMessage = '';

    if (!this.loginData.email.trim()) {
      this.errorMessage = 'Vui lòng nhập email';
      return;
    }

    if (!this.loginData.password.trim()) {
      this.errorMessage = 'Vui lòng nhập mật khẩu';
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(this.loginData.email)) {
      this.errorMessage = 'Email không đúng định dạng';
      return;
    }

    this.authService.login(this.loginData).subscribe({
      next: (res) => {
        this.authService.saveUser(res);

        this.successMessage = res.message ?? 'Đăng nhập thành công';

        this.router.navigate([this.returnUrl]);
      },
      error: (err) => {
        if (typeof err.error === 'string') {
          this.errorMessage = err.error;
        } else {
          this.errorMessage = 'Email hoặc mật khẩu không đúng';
        }
      },
    });
  }
}
