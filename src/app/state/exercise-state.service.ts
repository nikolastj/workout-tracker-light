import { Injectable } from '@angular/core';
import { ExerciseApiService } from '../api/exercise-api.service';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ExerciseStateService {
  exercises = new BehaviorSubject<any[] | null>(null);

  constructor(private api: ExerciseApiService) {}

  loadData() {
    if (!this.exercises.getValue()?.length)
      this.api.getExercises().subscribe(res => {
        this.exercises.next(res);
      });
  }
}
