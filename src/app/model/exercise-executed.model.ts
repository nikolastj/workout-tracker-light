import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ExerciseSet, ExerciseSetForm, ExerciseSetFormControls } from './exercise-set.model';
import { ExerciseType } from './exercise-type.model';
import { FormArray } from '@angular/forms';

export class ExerciseExecutedDTO {
  id: number;
  sets: ExerciseSet[];
  exerciseTypeId: number;

  constructor(id: number, sets: ExerciseSet[], exerciseTypeId: number) {
    this.id = id;
    this.sets = sets;
    this.exerciseTypeId = exerciseTypeId;
  }
}

export class ExerciseExecuted extends ExerciseExecutedDTO {
  exerciseType?: ExerciseType;

  constructor(
    id: number,
    sets: ExerciseSet[],
    exerciseTypeId: number,
    exerciseType?: ExerciseType
  ) {
    super(id, sets, exerciseTypeId);
    this.exerciseType = exerciseType;
  }

  static fromDTOAndTypes(
    dto: ExerciseExecutedDTO,
    exerciseTypes: ExerciseType[]
  ): ExerciseExecuted {
    const exerciseType = exerciseTypes.find(type => type.id === dto.exerciseTypeId);

    return new ExerciseExecuted(dto.id, dto.sets, dto.exerciseTypeId, exerciseType);
  }
}

export type ExerciseExecutedFormControls = {
  id: FormControl<number | null>;
  sets: FormArray<FormGroup<ExerciseSetFormControls>>;
  exerciseTypeId: FormControl<number | null>;
  exerciseType: FormControl<ExerciseType | null>;
};

export class ExerciseExecutedForm extends FormGroup<ExerciseExecutedFormControls> {
  constructor(value?: ExerciseExecuted) {
    super({
      id: new FormControl<number | null>(value?.id ?? null),
      sets: new FormArray(value?.sets.map(set => new ExerciseSetForm(set)) ?? [], [
        Validators.required
      ]),
      exerciseTypeId: new FormControl<number | null>(value?.exerciseTypeId ?? null),
      exerciseType: new FormControl<ExerciseType | null>(value?.exerciseType ?? null)
    });
  }
}
