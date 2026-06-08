import { CommonModule } from '@angular/common';
import { Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { finalize } from 'rxjs';
import { AuthService } from '../../../core/services/auth';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './forgot-password.html',
  styleUrl: './forgot-password.scss'
})
export class ForgotPassword {
  step = signal(1);

  email = signal('');
  pin = signal('');
  newPassword = signal('');
  confirmPassword = signal('');

  errorMessage = signal('');
  successMessage = signal('');
  isLoading = signal(false);

  constructor(
    private authService: AuthService,
    private router: Router
  ) { }

  sendPin(): void {
    this.errorMessage.set('');
    this.successMessage.set('');

    if (!this.email().trim()) {
      this.errorMessage.set('Vui lòng nhập email');
      return;
    }

    this.isLoading.set(true);

    this.authService.forgotPassword({ email: this.email() })
      .pipe(finalize(() => this.isLoading.set(false)))
      .subscribe({
        next: (res) => {
          this.successMessage.set(res);
          this.step.set(2);
        },
        error: (err) => {
          this.errorMessage.set(
            typeof err.error === 'string'
              ? err.error
              : 'Mã PIN không hợp lệ'
          );
        }
      });
  }

  resetPassword(): void {
    this.errorMessage.set('');
    this.successMessage.set('');

    if (!this.newPassword().trim()) {
      this.errorMessage.set('Vui lòng nhập mật khẩu mới');
      return;
    }

    if (this.newPassword() !== this.confirmPassword()) {
      this.errorMessage.set('Mật khẩu xác nhận không khớp');
      return;
    }

    this.isLoading.set(true);

    this.authService.resetPassword({
      email: this.email(),
      pin: this.pin(),
      newPassword: this.newPassword()
    })
      .pipe(finalize(() => this.isLoading.set(false)))
      .subscribe({
        next: (res) => {
          this.successMessage.set(res);

          setTimeout(() => {
            this.router.navigate(['/login']);
          }, 1500);
        },
        error: (err) => {
          this.errorMessage.set(
            typeof err.error === 'string'
              ? err.error
              : 'Không thể đổi mật khẩu'
          );
        }
      });
  }

  verifyPin(): void {
    this.errorMessage.set('');
    this.successMessage.set('');

    if (!this.pin().trim()) {
      this.errorMessage.set('Vui lòng nhập mã PIN');
      return;
    }

    this.isLoading.set(true);

    this.authService.verifyResetPin({
      email: this.email(),
      pin: this.pin()
    })
      .pipe(finalize(() => this.isLoading.set(false)))
      .subscribe({
        next: (res) => {
          this.successMessage.set(res);
          this.step.set(3);
        },
        error: (err) => {
          this.errorMessage.set(
            typeof err.error === 'string'
              ? err.error
              : 'Mã PIN không hợp lệ'
          );
        }
      });
  }
}