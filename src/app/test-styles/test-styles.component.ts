import { Component, model } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatRadioModule } from '@angular/material/radio';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-test-styles',
  imports: [MatCardModule, MatCheckboxModule, FormsModule, MatRadioModule],
  templateUrl: './test-styles.component.html',
  styleUrl: './test-styles.component.scss'
})
export class TestStylesComponent {
  readonly checked = model(false);
  readonly indeterminate = model(false);
  readonly labelPosition = model<'before' | 'after'>('after');
  readonly disabled = model(false);
}
