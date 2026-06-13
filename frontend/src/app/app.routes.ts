import { Routes } from '@angular/router';

import { MainLayout } from './layouts/main-layout/main-layout';
import { Home } from './features/home/home';
import { CourtList } from './features/courts/court-list/court-list';
import { CourtDetail } from './features/courts/court-detail/court-detail';
import { BookingForm } from './features/booking/booking-form/booking-form';
import { MyBookings } from './features/booking/my-bookings/my-bookings';
import { Dashboard } from './features/admin/dashboard/dashboard';
import { CourtManagement } from './features/admin/court-management/court-management';
import { BookingManagement } from './features/admin/booking-management/booking-management';
import { Login } from './features/auth/login/login';
import { Register } from './features/auth/register/register';
import { Unauthorized } from './features/unauthorized/unauthorized';
import { adminGuard } from './core/guards/admin.guard';
import { UserManagement } from './features/admin/user-management/user-management';
import { AdminLayout } from './layouts/admin-layout/admin-layout';
import { ForgotPassword } from './features/auth/forgot-password/forgot-password';

export const routes: Routes = [
  {
    path: '',
    component: MainLayout,
    children: [
      { path: '', component: Home },
      { path: 'courts', component: CourtList },
      { path: 'courts/:id', component: CourtDetail },
      { path: 'booking/:courtId', component: BookingForm },
      { path: 'my-bookings', component: MyBookings },

      {
        path: 'admin',
        component: AdminLayout,
        canActivate: [adminGuard],
        children: [
          { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
          { path: 'dashboard', component: Dashboard },
          { path: 'courts', component: CourtManagement },
          { path: 'bookings', component: BookingManagement },
          { path: 'users', component: UserManagement }
        ]
      },

    ]
  },
  { path: 'login', component: Login },
  { path: 'register', component: Register },
  { path: 'forgot-password', component: ForgotPassword },
  { path: 'unauthorized', component: Unauthorized },
  { path: '**', redirectTo: '' }
];