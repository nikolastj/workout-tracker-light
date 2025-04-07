import { Component, Inject } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { CommonModule } from '@angular/common';
import { ExerciseType } from '../../model/exercise-type.model';
import { ExerciseExecuted, ExerciseExecutedForm } from '../../model/exercise-executed.model';
import { MatIconModule } from '@angular/material/icon';
import { SetFormComponent } from './set-form/set-form.component';
import { ExerciseSet, ExerciseSetForm } from '../../model/exercise-set.model';
import { ConfirmationDialogComponent } from '../../shared/confirmation-dialog.component';
import { MatChipsModule } from '@angular/material/chips';

@Component({
  selector: 'app-exercise-executed-dialog',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatIconModule,
    SetFormComponent,
    MatChipsModule
  ],
  templateUrl: './exercise-executed-dialog.component.html'
})
export class ExerciseExecutedDialogComponent {
  form: ExerciseExecutedForm;
  exerciseName = '';
  exerciseMuscle = '';
  exerciseEquipment = '';
  setForm?: ExerciseSetForm = new ExerciseSetForm();
  selectedSetIndex?: number;
  isEdit = false;
  lastExecutedExercise?: ExerciseExecuted;

  constructor(
    private dialog: MatDialog,
    public dialogRef: MatDialogRef<ExerciseExecutedDialogComponent>,
    @Inject(MAT_DIALOG_DATA)
    public data: {
      selectedExerciseType: ExerciseType;
      editData: ExerciseExecuted;
      lastCompletedExercise: ExerciseExecuted | undefined;
    }
  ) {
    this.form = new ExerciseExecutedForm(data.editData);
    this.isEdit = !!data.editData;
    this.form.controls.exerciseType.setValue(data.selectedExerciseType);
    this.form.controls.exerciseTypeId.setValue(data.selectedExerciseType.id);
    this.exerciseName = data.selectedExerciseType.name;
    this.exerciseMuscle =
      data.selectedExerciseType.primaryMuscleTargeted?.popularName ??
      data.selectedExerciseType.primaryMuscleTargeted?.name ??
      '';
    this.exerciseEquipment = data.selectedExerciseType.requisiteUsed ?? '';
    this.lastExecutedExercise = data.lastCompletedExercise;
  }

  private get latestSetWeightAndReps(): ExerciseSet | undefined {
    if (!this.form.controls.sets.controls.length) return;
    const latestSetForm = this.form.controls.sets.controls.reduce((prev, current) => {
      const prevOrder = prev.controls.order.value ?? 0;
      const currentOrder = current.controls.order.value ?? 0;
      return prevOrder > currentOrder ? prev : current;
    });
    return { ...latestSetForm.getRawValue(), order: null, isDropSet: false, isWarmupSet: false };
  }

  onSave(): void {
    if (this.form.valid) {
      this.dialogRef.close(this.form);
    }
  }

  onCancel(): void {
    if (this.form?.touched) {
      const dialogRef = this.dialog.open(ConfirmationDialogComponent);

      dialogRef.afterClosed().subscribe(result => {
        if (result) {
          this.dialogRef.close();
        }
      });
    } else {
      this.dialogRef.close();
    }
  }

  addSet(set: ExerciseSetForm) {
    this.form.controls.sets.push(set);
    this.form.controls.sets.controls.forEach((set, i) => {
      set.controls.order.setValue(i + 1, { emitEvent: false });
    });
    this.clearSetForm(this.latestSetWeightAndReps);
  }

  editSet(set: ExerciseSetForm) {
    if (set.controls.order.value === this.setForm?.controls.order.value) {
      this.clearSetForm(this.latestSetWeightAndReps);
    } else {
      this.clearSetForm(set.getRawValue());
      this.selectedSetIndex = set.controls.order.value ?? undefined;
    }
  }

  deleteSet(index: number) {
    this.form.controls.sets.removeAt(index);
    this.form.controls.sets.controls.forEach((set, i) => {
      set.controls.order.setValue(i + 1, { emitEvent: false });
    });
    this.clearSetForm(this.latestSetWeightAndReps);
  }

  updateSet(set: ExerciseSetForm) {
    const index = this.form.controls.sets.controls.findIndex(
      s => s.controls.order.value === set.controls.order.value
    );
    if (index !== -1) {
      this.form.controls.sets.setControl(index, set);
    }
    this.clearSetForm(this.latestSetWeightAndReps);
  }

  clearSetForm(set?: ExerciseSet) {
    delete this.setForm;
    delete this.selectedSetIndex;
    this.form.markAllAsTouched();
    setTimeout(() => {
      this.setForm = new ExerciseSetForm(set);
    }, 100);
  }
}
