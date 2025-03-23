import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { ExerciseSheetsKeyService } from '../state/exercise-sheets-key.service';
import { ExerciseType, ExerciseTypeDTO } from '../model/exercise-type.model';
import { Muscle } from '../model/muscle.model';
import { Workout, WorkoutDTO } from '../model/workout.model';

@Injectable({
  providedIn: 'root'
})
export class ExerciseApiService {
  //temp solution before real BE and DB is completed
  get sheetUrl() {
    return `https://docs.google.com/spreadsheets/d/e/${this.key.exerciseSheetsKey}/pubhtml`;
  }

  constructor(
    private http: HttpClient,
    private key: ExerciseSheetsKeyService
  ) {}

  getExercises(): Observable<{
    exercises: ExerciseType[];
    muscles: Muscle[];
    workouts: Workout[];
  }> {
    const headers = new HttpHeaders({
      'Cache-Control': 'no-cache, no-store, must-revalidate',
      Pragma: 'no-cache'
    });

    return this.http.get(this.sheetUrl, { responseType: 'text', headers: headers }).pipe(
      map(data => {
        const parser = new DOMParser();
        const doc = parser.parseFromString(data, 'text/html');

        // Find all <table> elements (each table corresponds to a sheet)
        const tables = Array.from(doc.querySelectorAll('table'));

        const parsedSheets = tables.map((table, index) => {
          // Extract rows from the table
          const rows = Array.from(table.querySelectorAll('tr'));
          const extractedData = rows.map(row =>
            Array.from(row.querySelectorAll('td')).map(cell => cell.textContent || '')
          );

          return {
            name: `Sheet ${index + 1}`,
            data: extractedData
          };
        });
        console.log('sheets', parsedSheets);

        const musclesData = parsedSheets[0].data.filter(row => !!row.length);
        musclesData.shift();
        const muscles = musclesData.map(muscle => Muscle.fromArray(muscle));

        const exercisesData = parsedSheets[1].data.filter(row => !!row.length);
        exercisesData.shift();
        const exercises = exercisesData
          .map(exercise => ExerciseTypeDTO.fromArray(exercise))
          .map(exercise => ExerciseType.fromExerciseAndMuscles(exercise, muscles));

        const sheet = parsedSheets[2].data.filter(row => !!row.length);
        const flatSheet = sheet.reduce((acc, row) => acc.concat(row), []);
        const dataObjects = flatSheet.filter(cell => !!cell).map(cell => JSON.parse(cell));
        const workouts = dataObjects
          .map(cell => new WorkoutDTO(cell))
          .map(cell => Workout.fromDTOAndTypes(cell, exercises));

        const retVal: { exercises: ExerciseType[]; muscles: Muscle[]; workouts: Workout[] } = {
          exercises: exercises,
          muscles: muscles,
          workouts: workouts
        };

        console.log('workouts', retVal.workouts);
        return retVal;
      })
    );
  }
}
