import { FormControl, FormGroup } from '@angular/forms';

export class ExerciseSet {
  order: number | null;
  reps: number | null;
  weight: number | null;
  isWarmupSet: boolean | null;
  isDropSet: boolean | null;

  constructor(order: number, reps: number, weight: number, isWarmupSet = false, isDropSet = false) {
    this.order = order;
    this.reps = reps;
    this.weight = weight;
    this.isWarmupSet = isWarmupSet;
    this.isDropSet = isDropSet;
  }
}

export type ExerciseSetFormControls = {
  order: FormControl<number | null>;
  reps: FormControl<number | null>;
  weight: FormControl<number | null>;
  isWarmupSet: FormControl<boolean | null>;
  isDropSet: FormControl<boolean | null>;
};

export class ExerciseSetForm extends FormGroup<ExerciseSetFormControls> {
  constructor(value?: ExerciseSet) {
    super({
      order: new FormControl<number | null>(value?.order ?? null),
      reps: new FormControl<number | null>(value?.reps ?? 10),
      weight: new FormControl<number | null>(value?.weight ?? 30),
      isWarmupSet: new FormControl<boolean | null>(value?.isWarmupSet ?? false),
      isDropSet: new FormControl<boolean | null>(value?.isDropSet ?? false)
    });
  }
}
