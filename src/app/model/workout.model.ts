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
  exercisesDto: ExerciseExecutedDTO[];
  comment: string;
  energyLevel: number;

  constructor(data: Partial<WorkoutDTO>) {
    this.id = data.id || 0;
    this.dateCreated = new Date(data.dateCreated || new Date());
    this.exercisesDto = data.exercisesDto || [];
    this.comment = data.comment || '';
    this.energyLevel = data.energyLevel || 0;
  }
}

export class Workout extends WorkoutDTO {
  exercises: ExerciseExecuted[];

  constructor(data: WorkoutDTO, exercises: ExerciseExecuted[]) {
    super(data);
    this.exercises = exercises;
  }

  static fromDTOAndTypes(dto: WorkoutDTO, exerciseTypes: ExerciseType[]): Workout {
    const enrichedExercises = dto.exercisesDto.map(exerciseDTO =>
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
  constructor() {
    super({
      id: new FormControl<number | null>(null),
      dateCreated: new FormControl<Date | null>(new Date()),
      exercises: new FormArray<ExerciseExecutedForm>([], [Validators.required]),
      comment: new FormControl<string | null>(null),
      energyLevel: new FormControl<number | null>(null)
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
