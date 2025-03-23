import { Routes } from '@angular/router';
import { LoginComponent } from './public/login.component';
import { AuthGuard } from './auth/auth.guard';
import { HomeComponent } from './home/home.component';
import { StatsDashboardComponent } from './stats-dashboard/stats-dashboard.component';
import { CreateExerciseTypeComponent } from './exercise-type-create/exercise-type-create.component';
import { WorkoutCreateEditComponent } from './workout-create-edit/workout-create-edit.component';

export const routes: Routes = [
  { path: '', component: HomeComponent, canActivate: [AuthGuard] },
  { path: 'login', component: LoginComponent },
  { path: 'stats-dashboard', component: StatsDashboardComponent, canActivate: [AuthGuard] },
  { path: 'workout-create-edit', component: WorkoutCreateEditComponent, canActivate: [AuthGuard] },
  {
    path: 'exercise-type-create',
    component: CreateExerciseTypeComponent,
    canActivate: [AuthGuard]
  }
];
