import { Component, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';

import { AuthService } from '../../../core/services/auth';
import { UserService } from '../../../core/services/user.service';
import { ChangePasswordRequest } from '../../../core/models/change-password-request.model';

@Component({
  selector: 'app-change-password',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './change-password.html',
  styleUrl: './change-password.scss'
})
export class ChangePassword {

  data: ChangePasswordRequest = {
    oldPassword: '',
    newPassword: '',
    confirmPassword: ''
  };

  errorMessage = signal('');
  successMessage = signal('');
  isLoading = signal(false);

  constructor(
    private authService: AuthService,
    private userService: UserService,
    private router: Router
  ) {}

  onChangePassword(): void {
    this.errorMessage.set('');
    this.successMessage.set('');

    const currentUser = this.authService.getCurrentUser();

    if (!currentUser) {
      this.router.navigate(['/login']);
      return;
    }

    if (
      !this.data.oldPassword.trim() ||
      !this.data.newPassword.trim() ||
      !this.data.confirmPassword.trim()
    ) {
      this.errorMessage.set('Vui lòng nhập đầy đủ thông tin');
      return;
    }

    if (this.data.newPassword !== this.data.confirmPassword) {
      this.errorMessage.set('Mật khẩu xác nhận không khớp');
      return;
    }

    this.isLoading.set(true);

    this.userService.changePassword(currentUser.id, this.data).subscribe({
      next: (res) => {
        this.successMessage.set(res || 'Đổi mật khẩu thành công');
        this.errorMessage.set('');
        this.isLoading.set(false);

        this.data = {
          oldPassword: '',
          newPassword: '',
          confirmPassword: ''
        };

        setTimeout(() => {
          this.router.navigate(['/']);
        }, 1200);
      },
      error: (err) => {
        this.isLoading.set(false);

        if (typeof err.error === 'string') {
          this.errorMessage.set(err.error);
        } else {
          this.errorMessage.set('Đổi mật khẩu thất bại');
        }
      }
    });
  }
}