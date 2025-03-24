import { Directive } from '@angular/core';

@Directive()
export abstract class EditDirective {
  abstract hasUnsavedChanges(): boolean;
}
