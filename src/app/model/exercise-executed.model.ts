import { FormControl, FormGroup } from '@angular/forms';
import { ExerciseSet, ExerciseSetForm, ExerciseSetFormControls } from './exercise-set.model';
import { ExerciseType } from './exercise-type.model';
import { FormArray } from '@angular/forms';

export class ExerciseExecutedDTO {
  id: number;
  name: string;
  sets: ExerciseSet[];
  exerciseTypeId: number;

  constructor(id: number, name: string, sets: ExerciseSet[], exerciseTypeId: number) {
    this.id = id;
    this.name = name;
    this.sets = sets;
    this.exerciseTypeId = exerciseTypeId;
  }
}

export class ExerciseExecuted extends ExerciseExecutedDTO {
  exerciseType?: ExerciseType;

  constructor(
    id: number,
    name: string,
    sets: ExerciseSet[],
    exerciseTypeId: number,
    exerciseType?: ExerciseType
  ) {
    super(id, name, sets, exerciseTypeId);
    this.exerciseType = exerciseType;
  }

  static fromDTOAndTypes(
    dto: ExerciseExecutedDTO,
    exerciseTypes: ExerciseType[]
  ): ExerciseExecuted {
    const exerciseType = exerciseTypes.find(type => type.id === dto.exerciseTypeId);

    return new ExerciseExecuted(dto.id, dto.name, dto.sets, dto.exerciseTypeId, exerciseType);
  }
}

export type ExerciseExecutedFormControls = {
  id: FormControl<number | null>;
  name: FormControl<string | null>;
  sets: FormArray<FormGroup<ExerciseSetFormControls>>;
  exerciseTypeId: FormControl<number | null>;
  exerciseType: FormControl<ExerciseType | null>;
};

export class ExerciseExecutedForm extends FormGroup<ExerciseExecutedFormControls> {
  constructor() {
    super({
      id: new FormControl<number | null>(null),
      name: new FormControl<string | null>(null),
      sets: new FormArray<ExerciseSetForm>([]),
      exerciseTypeId: new FormControl<number | null>(null),
      exerciseType: new FormControl<ExerciseType | null>(null)
    });
  }
}
