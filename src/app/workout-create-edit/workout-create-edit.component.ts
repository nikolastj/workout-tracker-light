import { Component, OnInit } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { AppStateService } from '../state/app-state.service';
import { WorkoutDisplay, WorkoutForm } from '../model/workout.model';
import { ExerciseType } from '../model/exercise-type.model';
import { TriggerExerciseAddComponent } from './trigger-exercise-add/trigger-exercise-add.component';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog } from '@angular/material/dialog';
import { ExerciseExecutedForm } from '../model/exercise-executed.model';
import { ExerciseExecutedDialogComponent } from './exercise-executed-dialog/exercise-executed-dialog.component';
import { ConfirmationDialogComponent } from '../shared/confirmation-dialog.component';
import { EditDirective } from '../shared/edit.directive';

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
export class WorkoutCreateEditComponent extends EditDirective implements OnInit {
  form?: WorkoutForm;
  exerciseTypes: ExerciseType[] = [];
  editId?: number;

  constructor(
    private state: AppStateService,
    private router: Router,
    private dialog: MatDialog,
    private route: ActivatedRoute
  ) {
    super();
  }

  ngOnInit(): void {
    this.setOptions();
    this.getRouteParam();
    this.initForm();
  }

  private setOptions() {
    this.exerciseTypes = this.state.exerciseTypes.getValue() || [];
  }

  private getRouteParam() {
    this.editId = Number(this.route.snapshot.paramMap.get('id'));
  }
  private initForm() {
    const storageList = localStorage.getItem('workouts_v2')
      ? JSON.parse(localStorage.getItem('workouts_v2') || '[]')
      : [];

    const workout = [...(this.state.workouts.getValue() ?? []), ...storageList].find(
      w => w.id === this.editId
    );

    this.form = new WorkoutForm(workout);
    if (!this.editId) WorkoutForm.setId(this.form, this.state);
  }

  get selectedExercisesIds(): number[] {
    const aca = this.form?.getRawValue();
    if (!aca) return [];
    return aca.exercises.map(e => e.exerciseTypeId).filter(id => id !== undefined && id !== null);
  }

  onSubmit(): void {
    if (this.form?.valid) {
      console.log('Form Submitted', this.form.value);
      const formValue = this.form.getRawValue() as WorkoutDisplay;
      formValue.isLocal = true;
      if (this.editId) formValue.isEdit = true;

      let workouts = JSON.parse(localStorage.getItem('workouts_v2') || '[]');
      workouts.push(formValue);
      localStorage.setItem('workouts_v2', JSON.stringify(workouts));

      this.form = new WorkoutForm();
      this.router.navigate(['']);
    }
  }

  onCancel(): void {
    if (this.form?.touched) {
      const dialogRef = this.dialog.open(ConfirmationDialogComponent);

      dialogRef.afterClosed().subscribe(result => {
        if (result) {
          this.form?.markAsUntouched();
          this.router.navigate(['']);
        }
      });
    } else {
      this.router.navigate(['']);
    }
  }

  addExercise(event: ExerciseType) {
    console.log('Adding exercise', event);
    const workouts = this.state.workouts.getValue() ?? [];
    workouts.sort((a, b) => new Date(a.dateCreated).getTime() - new Date(b.dateCreated).getTime());
    const lastCompletedExercise = workouts
      .find(workout => workout.exercises.some(exercise => exercise.exerciseTypeId === event.id))
      ?.exercises.find(exercise => exercise.exerciseTypeId === event.id);
    console.log('previouslyDone', lastCompletedExercise);

    const dialogRef = this.dialog.open(ExerciseExecutedDialogComponent, {
      data: {
        selectedExerciseType: event,
        lastCompletedExercise: lastCompletedExercise,
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

  override hasUnsavedChanges(): boolean {
    if (this.form?.touched) {
      return true;
    }
    return false;
  }
}
