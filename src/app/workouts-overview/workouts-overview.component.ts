import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { WorkoutDisplay } from '../model/workout.model';
import { decodeObject, encodeObject } from '../shared/utils';
import { AppStateService } from '../state/app-state.service';
import {
  ConfirmationDialogComponent,
  ConfirmModalProps
} from '../shared/confirmation-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';

@Component({
  selector: 'wtl-workouts-overview',
  imports: [CommonModule, MatButtonModule],
  templateUrl: './workouts-overview.component.html'
})
export class WorkoutsOverviewComponent {
  list: WorkoutDisplay[] = [];
  storageList: WorkoutDisplay[] = [];
  constructor(
    private state: AppStateService,
    private dialog: MatDialog,
    private router: Router
  ) {
    this.loadLists();
  }

  loadLists() {
    const list = this.state.workouts.getValue() ?? [];
    const storageList = localStorage.getItem('workouts_v2')
      ? JSON.parse(localStorage.getItem('workouts_v2') || '[]')
      : [];

    const prunedStorageList = storageList.filter(
      (item: WorkoutDisplay) =>
        !list.some((listItem: WorkoutDisplay) => listItem.id === item.id && !listItem.isEdit)
    );
    prunedStorageList.forEach((item: WorkoutDisplay) => {
      item.isLocal = true;
    });

    this.storageList = prunedStorageList;
    this.list = [...list, ...prunedStorageList].sort(
      (a, b) => new Date(b.dateCreated).getTime() - new Date(a.dateCreated).getTime()
    );

    localStorage.setItem('workouts_v2', JSON.stringify(prunedStorageList));
  }

  copyToClipboard(workout: WorkoutDisplay) {
    const dialogData = new ConfirmModalProps();
    dialogData.title = 'Copy Workout';
    dialogData.message = 'Do you want to copy this workout to clipboard?';
    dialogData.confirmButtonText = 'Copy';
    dialogData.cancelButtonText = 'Edit';

    const dialogRef = this.dialog.open(ConfirmationDialogComponent, { data: dialogData });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        if (workout.isEdit) {
          workout.isEdit = false;
          localStorage.setItem('workouts_v2', JSON.stringify(this.storageList));
        }

        alert('Workout copied to clipboard');
        console.log('Copying workout to clipboard:', workout);
        const val = encodeObject(workout);
        navigator.clipboard.writeText(encodeObject(workout)).then(() => {
          console.log('Copied to clipboard!');
          console.log(decodeObject(val));
        });
      } else {
        this.router.navigate(['/workout-create-edit/' + workout.id]);
      }
    });
  }
}
