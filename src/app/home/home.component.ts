import { Component } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { MatButtonModule } from '@angular/material/button';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ExerciseSheetsKeyService } from '../state/exercise-sheets-key.service';
import { getNewlyAddedExercises } from '../shared/utils';
import { Workout } from '../model/workout.model';

@Component({
  selector: 'wtl-home',
  imports: [MatButtonModule, MatDividerModule, MatIconModule, RouterModule, CommonModule],
  templateUrl: './home.component.html'
})
export class HomeComponent {
  showExtraButtons = false;

  constructor(
    private router: Router,
    private key: ExerciseSheetsKeyService
  ) {}

  toggleExtraButtons() {
    this.showExtraButtons = true;
  }

  logout() {
    this.key.clear();
    this.router.navigate(['/login']);
  }

  copyNewExerciseTypes() {
    const exercises = getNewlyAddedExercises();
    const retVal = exercises.map(item => item.sheetsRow).join('\n');

    navigator.clipboard
      .writeText(retVal)
      .then(() => {
        console.log('Copied to clipboard!');
        console.log(retVal);
      })
      .catch(err => {
        console.error('Failed to copy: ', err);
      });
  }

  copyNewWorkouts() {
    console.log('TBD');
  }

  checkWorkouts() {
    const workouts: Workout = JSON.parse(localStorage.getItem('workouts_v2') || '[]');
    console.log('Workouts:', workouts);
    this.router.navigate(['/workouts-overview']);
  }
}
