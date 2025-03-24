import { Injectable } from '@angular/core';
import { CanDeactivate } from '@angular/router';
import { EditDirective } from './edit.directive';

@Injectable({
  providedIn: 'root'
})
export class CanDeactivateGuard implements CanDeactivate<EditDirective> {
  canDeactivate(component: EditDirective): boolean {
    if (component.hasUnsavedChanges()) {
      return confirm('You have unsaved changes! Do you really want to leave?');
    }
    return true;
  }
}
