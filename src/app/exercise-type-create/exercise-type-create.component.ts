import { Component, OnInit } from '@angular/core';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AppStateService } from '../state/app-state.service';
import { ExerciseTypeForm } from '../model/exercise-type.form';
import { Muscle } from '../model/muscle.model';
import { ExerciseType, ExerciseTypeDTO } from '../model/exercise-type.model';
import { ConfirmationDialogComponent } from '../shared/confirmation-dialog.component';
import { DestroyableDirective } from '../shared/destroyable.directive';
import { takeUntil } from 'rxjs';
import { pushNewExercise } from '../shared/utils';

@Component({
  selector: 'wtl-create-exercise-type',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatSlideToggleModule,
    MatDialogModule
  ],
  templateUrl: './exercise-type-create.component.html'
})
export class CreateExerciseTypeComponent extends DestroyableDirective implements OnInit {
  form?: ExerciseTypeForm;
  muscles: Muscle[] = [];
  exerciseTypes: ExerciseType[] = [];
  enableVariationControl = new FormControl(false);

  constructor(
    private state: AppStateService,
    private dialog: MatDialog,
    private router: Router
  ) {
    super();
  }

  ngOnInit(): void {
    this.form = new ExerciseTypeForm(this.state);
    ExerciseTypeForm.setId(this.form, this.state);
    this.form.controls.variationOfExerciseId.disable();
    this.setOptions();
    this.addFormEffects();
  }

  private setOptions() {
    this.muscles = this.state.muscles.getValue() || [];
    this.exerciseTypes = this.state.exerciseTypes.getValue() || [];
  }

  private addFormEffects() {
    this.form?.controls.variationOfExerciseId.valueChanges
      .pipe(takeUntil(this.destroyed))
      .subscribe(variationId => {
        const selectedExercise = this.exerciseTypes.find(exercise => exercise.id === variationId);
        if (selectedExercise) {
          this.form?.patchValue({
            primaryMuscleTargetedId: selectedExercise.primaryMuscleTargetedId,
            secondaryMusclesTargetedIds: selectedExercise.secondaryMusclesTargetedIds
          });
        }
      });

    this.enableVariationControl.valueChanges.pipe(takeUntil(this.destroyed)).subscribe(enabled => {
      const variationControl = this.form?.controls.variationOfExerciseId;
      if (enabled) {
        variationControl?.enable();
      } else {
        variationControl?.disable();
        variationControl?.reset();
      }
    });
  }

  onSubmit(): void {
    if (this.form?.valid) {
      const {
        id,
        name,
        description,
        requisiteUsed,
        primaryMuscleTargetedId,
        secondaryMusclesTargetedIds,
        usesNegativeWeight,
        variationOfExerciseId
      } = this.form.value;
      const value = new ExerciseTypeDTO(
        id as number,
        name as string,
        description as string,
        requisiteUsed as string,
        primaryMuscleTargetedId as number,
        secondaryMusclesTargetedIds as number[],
        usesNegativeWeight as boolean,
        variationOfExerciseId as number
      );
      const exerciseType = ExerciseType.fromExerciseAndMuscles(value, this.muscles);
      exerciseType.copyExerciseToClipboard();
      pushNewExercise(exerciseType);
      this.state.exerciseTypes.next([...(this.state.exerciseTypes.getValue() || []), exerciseType]);
      this.router.navigate(['']);
    }
  }

  onCancel(): void {
    if (this.form?.touched) {
      const dialogRef = this.dialog.open(ConfirmationDialogComponent, {
        panelClass: 'custom-dialog-theme'
      });

      dialogRef.afterClosed().subscribe(result => {
        if (result) {
          this.router.navigate(['']);
        }
      });
    } else {
      this.router.navigate(['']);
    }
  }
}
