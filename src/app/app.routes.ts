import { Routes } from '@angular/router';

import { LoginComponent } from './components/login/login';
import { CallbackComponent } from './components/callback/callback';
import { DashboardComponent } from './components/dashboard/dashboard';

export const routes: Routes = [
  {
    path: '', component: LoginComponent,
  },
  {
    path: 'callback', component: CallbackComponent,
  },
  {
    path: 'dashboard', component: DashboardComponent,
  },
];