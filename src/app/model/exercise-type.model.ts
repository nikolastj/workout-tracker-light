import { Muscle } from './muscle.model';

export class ExerciseTypeDTO {
  id: number;
  name: string;
  description: string | null;
  requisiteUsed: string | null;
  primaryMuscleTargetedId: number;
  secondaryMusclesTargetedIds: number[];
  usesNegativeWeight: boolean;
  variationOfExerciseId: number | null;

  constructor(
    id: number,
    name: string,
    description: string | null,
    requisiteUsed: string | null,
    primaryMuscleTargetedId: number,
    secondaryMusclesTargetedIds: number[],
    usesNegativeWeight: boolean,
    variationOfExerciseId: number | null
  ) {
    this.id = id;
    this.name = name;
    this.description = description;
    this.requisiteUsed = requisiteUsed;
    this.primaryMuscleTargetedId = primaryMuscleTargetedId;
    this.secondaryMusclesTargetedIds = secondaryMusclesTargetedIds;
    this.usesNegativeWeight = usesNegativeWeight;
    this.variationOfExerciseId = variationOfExerciseId;
  }

  static fromArray(data: string[]): ExerciseTypeDTO {
    // Helper function to assign values
    const assignValue = (value: string, isId: boolean = false, isArray: boolean = false): any => {
      if (value === '-') {
        return isArray ? [] : null;
      }
      if (isId && !isArray) return parseInt(value, 10);
      return isArray ? JSON.parse(value) : value;
    };

    // Assigning values through the static method
    const id = assignValue(data[0], true);
    const name = assignValue(data[1]);
    const description = assignValue(data[2]);
    const requisiteUsed = assignValue(data[3]);
    const primaryMuscleTargetedId = assignValue(data[4], true);
    const secondaryMusclesTargetedIds = assignValue(data[5], false, true);
    const usesNegativeWeight = data[6] === 'TRUE';
    const variationOfExerciseId = assignValue(data[7], true);

    return new ExerciseTypeDTO(
      id,
      name,
      description,
      requisiteUsed,
      primaryMuscleTargetedId,
      secondaryMusclesTargetedIds,
      usesNegativeWeight,
      variationOfExerciseId
    );
  }

  get sheetsRow(): string {
    const values = [
      this.id,
      this.name,
      this.description?.trim() ? this.description : '-',
      this.requisiteUsed?.trim() ? this.requisiteUsed : '-',
      this.primaryMuscleTargetedId,
      this.secondaryMusclesTargetedIds.length
        ? `[${this.secondaryMusclesTargetedIds.join(', ')}]`
        : '-',
      this.usesNegativeWeight ? 'TRUE' : 'FALSE',
      this.variationOfExerciseId ?? '-'
    ];

    return values.join('\t');
  }

  copyExerciseToClipboard() {
    const rowText = this.sheetsRow;

    // Copy to clipboard
    navigator.clipboard
      .writeText(rowText)
      .then(() => {
        console.log('Copied to clipboard!');
      })
      .catch(err => {
        console.error('Failed to copy: ', err);
      });
  }
}

export class ExerciseType extends ExerciseTypeDTO {
  primaryMuscleTargeted?: Muscle;
  secondaryMusclesTargeted: Muscle[];

  constructor(
    id: number,
    name: string,
    description: string | null,
    requisiteUsed: string | null,
    primaryMuscleTargetedId: number,
    secondaryMusclesTargetedIds: number[],
    usesNegativeWeight: boolean,
    variationOfExerciseId: number | null,
    primaryMuscleTargeted?: Muscle,
    secondaryMusclesTargeted: Muscle[] = []
  ) {
    super(
      id,
      name,
      description,
      requisiteUsed,
      primaryMuscleTargetedId,
      secondaryMusclesTargetedIds,
      usesNegativeWeight,
      variationOfExerciseId
    );
    this.primaryMuscleTargeted = primaryMuscleTargeted;
    this.secondaryMusclesTargeted = secondaryMusclesTargeted;
  }

  static fromExerciseAndMuscles(exercise: ExerciseTypeDTO, muscles: Muscle[]): ExerciseType {
    // Find primary muscle
    const primaryMuscle = muscles.find(muscle => muscle.id === exercise.primaryMuscleTargetedId);

    // Find secondary muscles
    const secondaryMuscles = exercise.secondaryMusclesTargetedIds
      ? muscles.filter(muscle => exercise.secondaryMusclesTargetedIds.includes(muscle.id))
      : [];

    return new ExerciseType(
      exercise.id,
      exercise.name,
      exercise.description,
      exercise.requisiteUsed,
      exercise.primaryMuscleTargetedId,
      exercise.secondaryMusclesTargetedIds,
      exercise.usesNegativeWeight,
      exercise.variationOfExerciseId,
      primaryMuscle,
      secondaryMuscles
    );
  }

  static recreate(exercise: ExerciseType): ExerciseType {
    return new ExerciseType(
      exercise.id,
      exercise.name,
      exercise.description,
      exercise.requisiteUsed,
      exercise.primaryMuscleTargetedId,
      exercise.secondaryMusclesTargetedIds,
      exercise.usesNegativeWeight,
      exercise.variationOfExerciseId,
      exercise.primaryMuscleTargeted,
      exercise.secondaryMusclesTargeted
    );
  }
}
