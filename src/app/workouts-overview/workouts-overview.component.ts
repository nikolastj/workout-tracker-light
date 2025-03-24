import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { Workout } from '../model/workout.model';
import { decodeObject, encodeObject } from '../shared/utils';
import { AppStateService } from '../state/app-state.service';

@Component({
  selector: 'wtl-workouts-overview',
  imports: [CommonModule, MatButtonModule],
  templateUrl: './workouts-overview.component.html'
})
export class WorkoutsOverviewComponent {
  list: Workout[] = [];
  constructor(private state: AppStateService) {
    this.loadLists();
  }

  loadLists() {
    const list = this.state.workouts.getValue() ?? [];
    const storageList = localStorage.getItem('workouts_v2')
      ? JSON.parse(localStorage.getItem('workouts_v2') || '[]')
      : [];

    this.list = [
      ...list,
      ...storageList.filter(
        (item: any) => !list.some((listItem: Workout) => listItem.id === item.id)
      )
    ];

    localStorage.setItem('workouts_v2', JSON.stringify(this.list));
  }

  copyToClipboard(workout: Workout) {
    console.log('Copying workout to clipboard:', workout);
    const val = encodeObject(workout);
    navigator.clipboard.writeText(encodeObject(workout)).then(() => {
      console.log('Copied to clipboard!');
      console.log(decodeObject(val));
    });
  }
}
