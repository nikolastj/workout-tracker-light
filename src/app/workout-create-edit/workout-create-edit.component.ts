import { Component, OnInit } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AppStateService } from '../state/app-state.service';
import { WorkoutForm } from '../model/workout.model';
import { ExerciseType } from '../model/exercise-type.model';
import { TriggerExerciseAddComponent } from './trigger-exercise-add/trigger-exercise-add.component';

@Component({
  selector: 'wtl-workout-create-edit',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatSlideToggleModule,
    TriggerExerciseAddComponent
  ],
  templateUrl: './workout-create-edit.component.html'
})
export class WorkoutCreateEditComponent implements OnInit {
  form?: WorkoutForm;
  exerciseTypes: ExerciseType[] = [];

  constructor(
    private state: AppStateService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.setOptions();
    this.initForm();
  }

  private initForm() {
    this.form = new WorkoutForm();
    WorkoutForm.setId(this.form, this.state);
  }

  private setOptions() {
    this.exerciseTypes = this.state.exerciseTypes.getValue() || [];
  }

  onSubmit(): void {
    if (this.form?.valid) {
      console.log('Form Submitted', this.form.value);
      this.router.navigate(['']);
    }
  }

  onCancel(): void {
    this.router.navigate(['']);
  }

  addExercise(event: ExerciseType) {
    console.log('Adding exercise', event);
  }
}
