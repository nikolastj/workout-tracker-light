import { Component, Input } from '@angular/core';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { CommonModule } from '@angular/common';

@Component({
  standalone: true,
  selector: 'wtl-full-screen-loader',
  template: `
    <div
      class="fixed inset-0 flex items-center justify-center bg-black z-50"
      [ngClass]="{ 'bg-opacity-50': transparent }"
    >
      <mat-spinner class="w-16 h-16"></mat-spinner>
    </div>
  `,
  imports: [CommonModule, MatProgressSpinnerModule]
})
export class FullScreenLoaderComponent {
  @Input() transparent = false;
}
