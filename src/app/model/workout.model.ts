import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import {
  ExerciseExecutedDTO,
  ExerciseExecutedForm,
  ExerciseExecutedFormControls
} from './exercise-executed.model';
import { ExerciseExecuted } from './exercise-executed.model';
import { ExerciseType } from './exercise-type.model';
import { AppStateService } from '../state/app-state.service';

export class WorkoutDTO {
  id: number;
  dateCreated: Date;
  exercises: ExerciseExecutedDTO[];
  comment: string;
  energyLevel: number;

  constructor(data: Partial<WorkoutDTO>) {
    this.id = data.id || 0;
    this.dateCreated = new Date(data.dateCreated || new Date());
    this.exercises = data.exercises || [];
    this.comment = data.comment || '';
    this.energyLevel = data.energyLevel || 0;
  }
}

export class Workout extends WorkoutDTO {
  override exercises: ExerciseExecuted[];

  constructor(data: WorkoutDTO, exercises: ExerciseExecuted[]) {
    super(data);
    this.exercises = exercises;
  }

  static fromDTOAndTypes(dto: WorkoutDTO, exerciseTypes: ExerciseType[]): Workout {
    const enrichedExercises = dto.exercises.map(exerciseDTO =>
      ExerciseExecuted.fromDTOAndTypes(exerciseDTO, exerciseTypes)
    );

    return new Workout(dto, enrichedExercises);
  }
}

export type WorkoutTypeFormControls = {
  id: FormControl<number | null>;
  dateCreated: FormControl<Date | null>;
  exercises: FormArray<FormGroup<ExerciseExecutedFormControls>>;
  comment: FormControl<string | null>;
  energyLevel: FormControl<number | null>;
};

export class WorkoutForm extends FormGroup<WorkoutTypeFormControls> {
  constructor(value?: Workout) {
    super({
      id: new FormControl<number | null>(value?.id ?? null),
      dateCreated: new FormControl<Date | null>(value?.dateCreated ?? new Date()),
      exercises: new FormArray<ExerciseExecutedForm>(
        value?.exercises.map(exercise => new ExerciseExecutedForm(exercise)) || [],
        [Validators.required]
      ),
      comment: new FormControl<string | null>(value?.comment ?? null),
      energyLevel: new FormControl<number | null>(value?.energyLevel ?? null)
    });
  }

  static setId(form: WorkoutForm, state: AppStateService) {
    if (!form) return;
    const workouts = state.workouts.getValue();
    if (!workouts) return;
    const highestId = Math.max(...workouts.map(et => et.id), 0);
    form.controls.id.setValue(highestId + 1, { emitEvent: false });
  }
}

//used for to highligh workouts that are not saved in the "database"
export class WorkoutDisplay extends Workout {
  isEdit?: boolean;
  isLocal?: boolean;
}
