import { Component, Input } from '@angular/core';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { CommonModule } from '@angular/common';

@Component({
  standalone: true,
  selector: 'wtl-full-screen-loader',
  template: `
    <div
      class="fixed inset-0 z-50 flex items-center justify-center bg-black"
      [ngClass]="{ 'bg-opacity-50': transparent }"
    >
      <mat-spinner class="h-16 w-16"></mat-spinner>
    </div>
  `,
  imports: [CommonModule, MatProgressSpinnerModule]
})
export class FullScreenLoaderComponent {
  @Input() transparent = false;
}
