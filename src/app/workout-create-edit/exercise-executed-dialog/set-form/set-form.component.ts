import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ExerciseSetForm } from '../../../model/exercise-set.model';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatIconModule } from '@angular/material/icon';
import { MatSlideToggle } from '@angular/material/slide-toggle';
import { DestroyableDirective } from '../../../shared/destroyable.directive';
import { takeUntil } from 'rxjs';

@Component({
  selector: 'wtl-set-form',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatIconModule,
    MatSlideToggle
  ],
  templateUrl: './set-form.component.html'
})
export class SetFormComponent extends DestroyableDirective implements OnInit {
  @Input() form!: ExerciseSetForm;
  @Output() emitSet = new EventEmitter<ExerciseSetForm>();
  @Output() emitEditSet = new EventEmitter<ExerciseSetForm>();
  isEdit = false;

  ngOnInit(): void {
    this.addEffects();
    if (this.form.controls.order.value) this.isEdit = true;
  }

  addEffects() {
    this.form.controls.isDropSet.valueChanges
      .pipe(takeUntil(this.destroyed))
      .subscribe(isDropSet => {
        if (isDropSet) {
          this.form.controls.isWarmupSet.setValue(false);
        }
      });

    this.form.controls.isWarmupSet.valueChanges
      .pipe(takeUntil(this.destroyed))
      .subscribe(isWarmupSet => {
        if (isWarmupSet) {
          this.form.controls.isDropSet.setValue(false);
        }
      });
  }

  modifyReps(value: number) {
    const newValue = (this.form.controls.reps.value ?? 0) + value;
    this.form.controls.reps.setValue(newValue < 0 ? 0 : newValue);
  }

  modifyWeight(value: number) {
    const newValue = (this.form.controls.weight.value ?? 0) + value;
    this.form.controls.weight.setValue(newValue < 0 ? 0 : newValue);
  }

  addSet() {
    if (this.isEdit) this.emitEditSet.emit(this.form);
    else this.emitSet.emit(this.form);
  }
}
