import { Component } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { MatButtonModule } from '@angular/material/button';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { ExerciseSheetsKeyService } from '../state/exercise-sheets-key.service';
import { AppStateService } from '../state/app-state.service';
import { getNewlyAddedExercises } from '../shared/utils';

@Component({
  selector: 'wtl-home',
  imports: [MatButtonModule, MatDividerModule, MatIconModule, RouterModule, CommonModule],
  templateUrl: './home.component.html'
})
export class HomeComponent {
  showExtraButtons = false;

  constructor(
    private router: Router,
    private key: ExerciseSheetsKeyService,
    private state: AppStateService
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
}
