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
import { MatIconModule } from '@angular/material/icon';
import { MatDialog } from '@angular/material/dialog';
import { ExerciseExecutedForm } from '../model/exercise-executed.model';
import { ExerciseExecutedDialogComponent } from './exercise-executed-dialog/exercise-executed-dialog.component';
import { ConfirmationDialogComponent } from '../shared/confirmation-dialog.component';

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
    TriggerExerciseAddComponent,
    MatIconModule
  ],
  templateUrl: './workout-create-edit.component.html'
})
export class WorkoutCreateEditComponent implements OnInit {
  form?: WorkoutForm;
  exerciseTypes: ExerciseType[] = [];

  constructor(
    private state: AppStateService,
    private router: Router,
    private dialog: MatDialog
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

  get selectedExercisesIds(): number[] {
    const aca = this.form?.getRawValue();
    if (!aca) return [];
    return aca.exercises.map(e => e.exerciseTypeId).filter(id => id !== undefined && id !== null);
  }

  onSubmit(): void {
    if (this.form?.valid) {
      console.log('Form Submitted', this.form.value);
      const formValue = this.form.getRawValue();

      let workouts = JSON.parse(localStorage.getItem('workouts') || '[]');
      workouts.push(formValue);
      localStorage.setItem('workouts', JSON.stringify(workouts));

      this.router.navigate(['']);
    }
  }

  onCancel(): void {
    if (this.form?.touched) {
      const dialogRef = this.dialog.open(ConfirmationDialogComponent);

      dialogRef.afterClosed().subscribe(result => {
        if (result) {
          this.router.navigate(['']);
        }
      });
    } else {
      this.router.navigate(['']);
    }
  }

  addExercise(event: ExerciseType) {
    console.log('Adding exercise', event);

    const dialogRef = this.dialog.open(ExerciseExecutedDialogComponent, {
      data: {
        selectedExerciseType: event,
        editData: null
      },
      width: '100vw',
      height: '100vh',
      maxWidth: '100vw',
      maxHeight: '100vh',
      panelClass: 'full-screen-dialog'
    });

    dialogRef.afterClosed().subscribe((result: ExerciseExecutedForm) => {
      if (result) {
        this.form?.controls.exercises.push(result);
        this.form?.markAsTouched();
      }
    });
  }

  editExercise(exercise: ExerciseExecutedForm, index: number) {
    console.log('Editing exercise', exercise);

    const dialogRef = this.dialog.open(ExerciseExecutedDialogComponent, {
      data: {
        selectedExerciseType: exercise.controls.exerciseType.value,
        editData: exercise.getRawValue()
      },
      width: '100vw',
      height: '100vh',
      maxWidth: '100vw',
      maxHeight: '100vh',
      panelClass: 'full-screen-dialog'
    });

    dialogRef.afterClosed().subscribe((result: ExerciseExecutedForm) => {
      if (result) {
        this.form?.controls.exercises.setControl(index, result);
        this.form?.markAsTouched();
      }
    });
  }
}
