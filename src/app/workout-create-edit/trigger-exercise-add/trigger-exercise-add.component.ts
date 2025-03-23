import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import {
  MatAutocompleteModule,
  MatAutocompleteSelectedEvent
} from '@angular/material/autocomplete';
import { CommonModule } from '@angular/common';
import { AppStateService } from '../../state/app-state.service';
import { ExerciseType } from '../../model/exercise-type.model';
import { DestroyableDirective } from '../../shared/destroyable.directive';
import { takeUntil, startWith, map } from 'rxjs';
import { AutoFocusDirective } from '../../shared/auto-focus.directive';

@Component({
  selector: 'wtl-trigger-exercise-add',
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatAutocompleteModule,
    AutoFocusDirective
  ],
  templateUrl: './trigger-exercise-add.component.html'
})
export class TriggerExerciseAddComponent extends DestroyableDirective {
  form = new FormGroup({
    exerciseSearchControl: new FormControl<string>('')
  });
  filteredExercises = this.exerciseSearchControl.valueChanges.pipe(
    takeUntil(this.destroyed),
    startWith(''),
    map(value => this._filterExercises(value || ''))
  );

  get exerciseSearchControl() {
    return this.form.get('exerciseSearchControl') as FormControl<string>;
  }

  showControl = false;
  @Input() selectedExerciseIds: number[] = [];
  @Output() addExercise = new EventEmitter<ExerciseType>();

  constructor(private state: AppStateService) {
    super();
  }

  selectExercise(event: MatAutocompleteSelectedEvent) {
    const val = event.option.value;
    if (val) {
      const selected = this.state.exerciseTypes.getValue()?.find(ex => ex.id === val);
      if (selected) {
        this.addExercise.emit(selected);
        this.exerciseSearchControl.setValue('', { emitEvent: false });
        this.showControl = false;
      }
    }
  }

  private _filterExercises(value?: string | number): ExerciseType[] {
    const exercises = this.state.exerciseTypes.getValue() || [];

    if (typeof value === 'number') {
      return exercises.filter(exercise => !this.selectedExerciseIds.includes(exercise.id));
    } else {
      const filterValue = value?.toLowerCase() ?? '';
      return exercises
        .filter(exercise => exercise.name.toLowerCase().includes(filterValue))
        .filter(exercise => !this.selectedExerciseIds.includes(exercise.id));
    }
  }
}
