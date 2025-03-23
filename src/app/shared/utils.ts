import { ExerciseType } from '../model/exercise-type.model';

export function getNewlyAddedExercises(): ExerciseType[] {
  const storedData = localStorage.getItem('newlyAddedExercises');

  if (!storedData) {
    localStorage.setItem('newlyAddedExercises', JSON.stringify([]));
    return [];
  }

  try {
    const parsedData: ExerciseType[] = JSON.parse(storedData);
    if (!Array.isArray(parsedData)) {
      localStorage.setItem('newlyAddedExercises', JSON.stringify([]));
      return [];
    }

    return parsedData.map(exercise => ExerciseType.recreate(exercise));
  } catch (error) {
    console.error('Failed to parse newlyAddedExercises from localStorage:', error);
    localStorage.setItem('newlyAddedExercises', JSON.stringify([]));
    return [];
  }
}

export function pushNewExercise(newExercise: ExerciseType) {
  const exercises = getNewlyAddedExercises();
  exercises.push(newExercise); // Add the new exercise
  localStorage.setItem('newlyAddedExercises', JSON.stringify(exercises));
  console.log('New exercise added and saved to localStorage.');
}

export function prunedNewlyAddedExercises(existingExercises: ExerciseType[]): ExerciseType[] {
  const newlyAddedExercises = getNewlyAddedExercises();

  if (newlyAddedExercises.length === 0) return existingExercises;
  const existingIds = new Set(existingExercises.map(ex => ex.id));
  return newlyAddedExercises.filter(ex => !existingIds.has(ex.id));
}

export function pruneAndPushNewlyAddedExercises(existingExercises: ExerciseType[]): ExerciseType[] {
  if (!Array.isArray(existingExercises)) {
    existingExercises = [];
  }

  const pruned = prunedNewlyAddedExercises(existingExercises);
  localStorage.setItem('newlyAddedExercises', JSON.stringify(pruned));

  return [...existingExercises, ...pruned];
}
