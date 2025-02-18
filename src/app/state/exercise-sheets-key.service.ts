import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ExerciseSheetsKeyService {
  private _exerciseSheetsKey = '';

  constructor() {
    this._exerciseSheetsKey = localStorage.getItem('ExerciseSheetsKey') ?? '';
  }

  get exerciseSheetsKey(): string {
    return this._exerciseSheetsKey;
  }

  setKey(value: string) {
    localStorage.setItem('ExerciseSheetsKey', value);
    this._exerciseSheetsKey = value;
  }
}
