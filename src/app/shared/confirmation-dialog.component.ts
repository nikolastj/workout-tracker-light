import { Component, Inject, Input } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule } from '@angular/material/dialog';

@Component({
  selector: 'app-confirmation-dialog',
  standalone: true,
  imports: [MatButtonModule, MatDialogModule],
  template: `
    <div class="flex flex-col p-4">
      <h1 mat-dialog-title>{{ title }}</h1>
      <div mat-dialog-content>
        <p>{{ message }}</p>
      </div>
      <div mat-dialog-actions class="dialog-actions">
        <button
          mat-raised-button
          color="accent"
          type="button"
          class="uppercase"
          (click)="onCancel()"
        >
          {{ cancelButtonText }}
        </button>
        <button
          mat-raised-button
          color="primary"
          type="button"
          class="uppercase"
          (click)="onConfirm()"
        >
          {{ confirmButtonText }}
        </button>
      </div>
    </div>
  `
})
export class ConfirmationDialogComponent {
  title = 'Confirm Action';
  message = 'Are you sure you want to proceed?';
  confirmButtonText = 'Confirm';
  cancelButtonText = 'Cancel';

  constructor(
    public dialogRef: MatDialogRef<ConfirmationDialogComponent>,
    @Inject(MAT_DIALOG_DATA)
    public data: ConfirmModalProps
  ) {
    if (data) {
      this.title = data.title;
      this.message = data.message;
      this.confirmButtonText = data.confirmButtonText;
      this.cancelButtonText = data.cancelButtonText;
    }
  }

  onConfirm(): void {
    this.dialogRef.close(true);
  }

  onCancel(): void {
    this.dialogRef.close(false);
  }
}

export class ConfirmModalProps {
  title: string = 'Confirm Action';
  message: string = 'Are you sure you want to proceed?';
  confirmButtonText: string = 'Confirm';
  cancelButtonText: string = 'Cancel';
}
