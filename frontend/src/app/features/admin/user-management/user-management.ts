import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { User } from '../../../core/models/user.model';
import { UserService } from '../../../core/services/user.service';

@Component({
  selector: 'app-user-management',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './user-management.html',
  styleUrl: './user-management.scss'
})
export class UserManagement implements OnInit {

  users = signal<User[]>([]);
  keyword = signal('');

  errorMessage = signal('');
  successMessage = signal('');
  isLoading = signal(false);

  private searchTimer: any;

  constructor(private userService: UserService) {}

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers(): void {
    this.isLoading.set(true);
    this.errorMessage.set('');

    this.userService.getAllUsers(this.keyword()).subscribe({
      next: (res: User[]) => {
        this.users.set(res);
        this.isLoading.set(false);
      },
      error: (err) => {
        console.log('Lỗi tải người dùng:', err);
        this.errorMessage.set('Không tải được danh sách người dùng');
        this.isLoading.set(false);
      }
    });
  }

  onKeywordChange(value: string): void {
    this.keyword.set(value);

    clearTimeout(this.searchTimer);

    this.searchTimer = setTimeout(() => {
      this.loadUsers();
    }, 300);
  }

  clearSearch(): void {
    this.keyword.set('');
    this.loadUsers();
  }

  changeRole(user: User, role: string): void {
    this.errorMessage.set('');
    this.successMessage.set('');

    this.userService.updateUserRole(user.id, role).subscribe({
      next: () => {
        this.successMessage.set('Cập nhật quyền người dùng thành công');
        this.loadUsers();
      },
      error: (err) => {
        this.errorMessage.set(err.error || 'Cập nhật quyền thất bại');
      }
    });
  }

  deleteUser(user: User): void {
    const confirmed = confirm(`Bạn có chắc muốn xóa người dùng ${user.fullName}?`);

    if (!confirmed) {
      return;
    }

    this.errorMessage.set('');
    this.successMessage.set('');

    this.userService.deleteUser(user.id).subscribe({
      next: () => {
        this.successMessage.set('Xóa người dùng thành công');
        this.loadUsers();
      },
      error: (err) => {
        this.errorMessage.set(err.error || 'Xóa người dùng thất bại');
      }
    });
  }
}