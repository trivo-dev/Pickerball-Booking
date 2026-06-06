import { Component, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { User } from '../../../core/models/user.model';
import {
  CreateUserRequest,
  UpdateUserRequest,
  UserService
} from '../../../core/services/user.service';

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

  isFormVisible = signal(false);
  isEditMode = signal(false);
  editingUserId = signal<number | null>(null);

  formData = signal<CreateUserRequest>({
    fullName: '',
    email: '',
    password: '',
    phone: '',
    role: 'USER'
  });

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

  openAddForm(): void {
    this.isFormVisible.set(true);
    this.isEditMode.set(false);
    this.editingUserId.set(null);
    this.clearMessages();

    this.formData.set({
      fullName: '',
      email: '',
      password: '',
      phone: '',
      role: 'USER'
    });
  }

  openEditForm(user: User): void {
    this.isFormVisible.set(true);
    this.isEditMode.set(true);
    this.editingUserId.set(user.id);
    this.clearMessages();

    this.formData.set({
      fullName: user.fullName,
      email: user.email,
      password: '',
      phone: user.phone,
      role: user.role
    });
  }

  cancelForm(): void {
    this.isFormVisible.set(false);
    this.isEditMode.set(false);
    this.editingUserId.set(null);
    this.clearMessages();

    this.formData.set({
      fullName: '',
      email: '',
      password: '',
      phone: '',
      role: 'USER'
    });
  }

  saveUser(): void {
    this.clearMessages();

    const data = this.formData();

    if (!data.fullName.trim()) {
      this.errorMessage.set('Họ tên không được để trống');
      return;
    }

    if (!data.email.trim()) {
      this.errorMessage.set('Email không được để trống');
      return;
    }

    if (!data.email.includes('@')) {
      this.errorMessage.set('Email không hợp lệ');
      return;
    }

    if (!this.isEditMode() && !data.password.trim()) {
      this.errorMessage.set('Mật khẩu không được để trống');
      return;
    }

    if (!this.isEditMode() && data.password.length < 6) {
      this.errorMessage.set('Mật khẩu phải có ít nhất 6 ký tự');
      return;
    }

    if (this.isEditMode()) {
      this.updateUser();
    } else {
      this.createUser();
    }
  }

  createUser(): void {
    this.userService.createUser(this.formData()).subscribe({
      next: () => {
        this.successMessage.set('Thêm người dùng thành công');
        this.cancelForm();
        this.loadUsers();
      },
      error: (err) => {
        this.errorMessage.set(err.error || 'Thêm người dùng thất bại');
      }
    });
  }

  updateUser(): void {
    const id = this.editingUserId();

    if (id === null) {
      this.errorMessage.set('Không xác định được người dùng cần sửa');
      return;
    }

    const data = this.formData();

    const updateData: UpdateUserRequest = {
      fullName: data.fullName,
      email: data.email,
      phone: data.phone,
      role: data.role
    };

    this.userService.updateUser(id, updateData).subscribe({
      next: () => {
        this.successMessage.set('Cập nhật thông tin người dùng thành công');
        this.cancelForm();
        this.loadUsers();
      },
      error: (err) => {
        this.errorMessage.set(err.error || 'Cập nhật người dùng thất bại');
      }
    });
  }

  changeRole(user: User, role: string): void {
    this.clearMessages();

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

    this.clearMessages();

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

  updateFormField(field: keyof CreateUserRequest, value: string): void {
    this.formData.update(current => ({
      ...current,
      [field]: value
    }));
  }

  clearMessages(): void {
    this.errorMessage.set('');
    this.successMessage.set('');
  }
}