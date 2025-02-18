import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, map, Observable, of } from 'rxjs';
import { ExerciseSheetsKeyService } from '../state/exercise-sheets-key.service';

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

  getExercises(): Observable<any[]> {
    const headers = new HttpHeaders({
      'Cache-Control': 'public, max-age=10800', // Cache for 1 hour
      Pragma: 'cache' // Optional: legacy caching
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
        const rows = parsedSheets[1].data.filter(row => !!row.length);
        rows.shift();
        console.log(rows);

        const retVal: any[] = rows;
        return retVal;
      })
      // catchError(error => {
      //   console.error('Error fetching or parsing the sheet:', error);
      //   return of(error);
      // })
    );
  }
}
