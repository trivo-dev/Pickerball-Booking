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

  errorMessage = signal('');
  successMessage = signal('');
  isLoading = signal(false);

  constructor(private userService: UserService) {}

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers(): void {
    this.isLoading.set(true);
    this.errorMessage.set('');
    this.successMessage.set('');

    this.userService.getAllUsers().subscribe({
      next: (res: User[]) => {
        console.log('Danh sách người dùng:', res);

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