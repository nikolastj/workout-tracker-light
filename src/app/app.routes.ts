import { Routes } from '@angular/router';
import { LoginComponent } from './public/login.component';
import { AuthGuard } from './auth/auth.guard';
import { HomeComponent } from './home/home.component';

export const routes: Routes = [
  { path: '', component: HomeComponent, canActivate: [AuthGuard] },
  { path: 'login', component: LoginComponent }
];
