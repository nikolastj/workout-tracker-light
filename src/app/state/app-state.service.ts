import { Injectable } from '@angular/core';
import { ExerciseApiService } from '../api/exercise-api.service';
import { BehaviorSubject, map, Observable, of, tap } from 'rxjs';
import { ExerciseType } from '../model/exercise-type.model';
import { Muscle } from '../model/muscle.model';
import { pruneAndPushNewlyAddedExercises } from '../shared/utils';
import { Workout } from '../model/workout.model';

@Injectable({
  providedIn: 'root'
})
export class AppStateService {
  exerciseTypes = new BehaviorSubject<ExerciseType[] | null>(null);
  muscles = new BehaviorSubject<Muscle[] | null>(null);
  workouts = new BehaviorSubject<Workout[] | null>([]);

  constructor(private api: ExerciseApiService) {}

  loadData(): Observable<boolean> {
    if (!this.exerciseTypes.getValue()?.length) {
      return this.api.getExercises().pipe(
        tap(res => {
          this.muscles.next(res.muscles);
          const exercises = pruneAndPushNewlyAddedExercises(res.exercises);
          this.exerciseTypes.next(exercises);
          this.workouts.next(res.workouts);
        }),
        map(() => true)
      );
    }
    return of(true);
  }
}
