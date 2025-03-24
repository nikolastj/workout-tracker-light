import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ExerciseType } from './exercise-type.model';
import { AppStateService } from '../state/app-state.service';

type ExerciseTypeFormControls = {
  id: FormControl<number | null>;
  name: FormControl<string | null>;
  description: FormControl<string | null>;
  requisiteUsed: FormControl<string | null>;
  primaryMuscleTargetedId: FormControl<number | null>;
  secondaryMusclesTargetedIds: FormControl<number[] | null>;
  usesNegativeWeight: FormControl<boolean | null>;
  variationOfExerciseId: FormControl<number | null>;
};

export class ExerciseTypeForm extends FormGroup<ExerciseTypeFormControls> {
  constructor(exerciseType?: ExerciseType) {
    super({
      id: new FormControl<number | null>(exerciseType ? exerciseType.id : null),
      name: new FormControl<string | null>(
        exerciseType ? exerciseType.name : '',
        Validators.required
      ),
      description: new FormControl<string | null>(exerciseType ? exerciseType.description : ''),
      requisiteUsed: new FormControl<string | null>(exerciseType ? exerciseType.requisiteUsed : ''),
      primaryMuscleTargetedId: new FormControl<number | null>(
        exerciseType ? exerciseType.primaryMuscleTargetedId : null,
        Validators.required
      ),
      secondaryMusclesTargetedIds: new FormControl<number[]>(
        exerciseType ? exerciseType.secondaryMusclesTargetedIds : []
      ),
      usesNegativeWeight: new FormControl<boolean>(
        exerciseType ? exerciseType.usesNegativeWeight : false
      ),
      variationOfExerciseId: new FormControl<number | null>(
        exerciseType ? exerciseType.variationOfExerciseId : null
      )
    });
  }

  static setId(exerciseType: ExerciseTypeForm, state: AppStateService) {
    if (!exerciseType) return;
    const exerciseTypes = state.exerciseTypes.getValue();
    if (!exerciseTypes) return;
    const highestId = Math.max(...exerciseTypes.map(et => et.id), 0);
    exerciseType.controls.id.setValue(highestId + 1, { emitEvent: false });
  }
}
