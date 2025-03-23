import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { catchError, finalize, tap } from 'rxjs/operators';
import { ExerciseSheetsKeyService } from '../state/exercise-sheets-key.service';
import { AppStateService } from '../state/app-state.service';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private loadingSubject = new BehaviorSubject<boolean>(false);
  loading$ = this.loadingSubject.asObservable();
  errorMsg = '';

  constructor(
    private key: ExerciseSheetsKeyService,
    private state: AppStateService
  ) {}

  /** Simulate auth check (Replace with real API call when BE and DB are ready) */
  checkAuth(): Observable<boolean> {
    if (!this.key.exerciseSheetsKey) {
      return of(false);
    }

    // if (!!this.state.exerciseTypes.getValue()) {
    //   return of(true);
    // }

    this.loadingSubject.next(true);
    return this.state.loadData().pipe(
      tap(() => {
        this.errorMsg = '';
      }),
      catchError(error => {
        console.log(error);
        this.errorMsg = 'Invalid key';
        this.key.setKey('');
        return of(false); // ❌ Return false if loadData() fails
      }),
      finalize(() => this.loadingSubject.next(false)) // ✅ Ensure loading stops
    );
  }
}
