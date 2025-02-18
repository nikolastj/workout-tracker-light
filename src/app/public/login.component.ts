import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormControl,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';
import { MatError, MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { Router } from '@angular/router';
import { ExerciseSheetsKeyService } from '../state/exercise-sheets-key.service';
import { AuthService } from '../auth/auth.service';
import { MatFormFieldModule } from '@angular/material/form-field';

@Component({
  standalone: true,
  selector: 'wtl-login',
  template: `
    <div class="mt-[25vh] flex h-full w-full items-start justify-center">
      <form [formGroup]="form" (ngSubmit)="submit()" class="max-w-96 space-y-4">
        <mat-form-field class="w-full">
          <mat-label>Paste Exercise Sheets Key</mat-label>
          <input matInput [formControl]="form.controls.key" required />
          <mat-error *ngIf="form.controls.key.hasError('invalidKey')">
            <strong>{{ errorMsg }}</strong></mat-error
          >
        </mat-form-field>

        <button
          mat-flat-button
          color="primary"
          class="w-full"
          type="submit"
          [disabled]="form.invalid"
        >
          <span class="uppercase">Submit</span>
        </button>
      </form>
    </div>
  `,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatError
  ]
})
export class LoginComponent {
  constructor(
    private router: Router,
    private key: ExerciseSheetsKeyService,
    private auth: AuthService
  ) {}

  form = new FormGroup({
    key: new FormControl<string>('', { nonNullable: true, validators: Validators.required })
  });

  get errorMsg() {
    return this.auth.errorMsg;
  }

  submit() {
    if (this.form.valid) {
      this.key.setKey(this.form.value.key ?? '');
      this.auth.checkAuth().subscribe(res => {
        if (!res) {
          this.form.controls.key.setErrors({ invalidKey: true });
        } else {
          this.router.navigate(['']);
        }
      });
    }
  }
}
