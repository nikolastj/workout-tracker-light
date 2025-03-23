import { FormControl, FormGroup } from '@angular/forms';

export class ExerciseSet {
  order: number;
  reps: number;
  weight: number;
  isWarmupSet: boolean;
  isDropSet: boolean;

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
  constructor() {
    super({
      order: new FormControl<number | null>(null),
      reps: new FormControl<number | null>(null),
      weight: new FormControl<number | null>(null),
      isWarmupSet: new FormControl<boolean | null>(null),
      isDropSet: new FormControl<boolean | null>(null)
    });
  }
}
