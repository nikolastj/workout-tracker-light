import { Component } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatToolbarModule } from '@angular/material/toolbar';

@Component({
  selector: 'wtl-stats-dashboard',
  imports: [MatIconModule, MatToolbarModule],
  templateUrl: './stats-dashboard.component.html'
})
export class StatsDashboardComponent {}
