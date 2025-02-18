import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { catchError, delay, finalize, map, tap } from 'rxjs/operators';
import { ExerciseSheetsKeyService } from '../state/exercise-sheets-key.service';
import { ExerciseApiService } from '../api/exercise-api.service';
import { ExerciseStateService } from '../state/exercise-state.service';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private isAuthenticated = false;
  private loadingSubject = new BehaviorSubject<boolean>(false);
  loading$ = this.loadingSubject.asObservable();
  errorMsg = '';

  constructor(
    private key: ExerciseSheetsKeyService,
    private api: ExerciseApiService,
    private state: ExerciseStateService
  ) {}

  /** Simulate auth check (Replace with real API call) */
  checkAuth(): Observable<boolean> {
    if (!this.key.exerciseSheetsKey) {
      return of(false);
    }

    if (!!this.state.exercises.getValue()) {
      this.isAuthenticated = true;
      return of(true);
    }

    this.loadingSubject.next(true);
    return this.api.getExercises().pipe(
      tap(res => {
        this.state.exercises.next(res);
        this.isAuthenticated = true;
        this.errorMsg = '';
      }),
      map(() => true), // ✅ Return true if API succeeds
      catchError(error => {
        console.log(error);
        this.errorMsg = 'Invalid key';
        this.key.setKey('');
        return of(false); // ❌ Return false if API fails
      }),
      finalize(() => this.loadingSubject.next(false)) // ✅ Ensure loading stops
    );
  }
}
