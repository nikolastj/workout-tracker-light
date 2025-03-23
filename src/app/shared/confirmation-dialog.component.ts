import { Component } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';

@Component({
  selector: 'app-confirmation-dialog',
  standalone: true,
  imports: [MatButtonModule, MatDialogModule],
  template: `
    <div class="flex flex-col p-4">
      <h1 mat-dialog-title>Confirm Action</h1>
      <div mat-dialog-content>
        <p>There is unsaved data. Are you sure you want to cancel?</p>
      </div>
      <div mat-dialog-actions class="dialog-actions">
        <button
          mat-raised-button
          color="accent"
          type="button"
          class="uppercase"
          (click)="onCancel()"
        >
          Cancel
        </button>
        <button
          mat-raised-button
          color="primary"
          type="button"
          class="uppercase"
          (click)="onConfirm()"
        >
          Confirm
        </button>
      </div>
    </div>
  `
})
export class ConfirmationDialogComponent {
  constructor(public dialogRef: MatDialogRef<ConfirmationDialogComponent>) {}

  onConfirm(): void {
    this.dialogRef.close(true);
  }

  onCancel(): void {
    this.dialogRef.close(false);
  }
}
