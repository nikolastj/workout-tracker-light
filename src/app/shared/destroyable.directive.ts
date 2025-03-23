import { Directive, OnDestroy } from '@angular/core';
import { Subject } from 'rxjs';

@Directive()
export abstract class DestroyableDirective implements OnDestroy {
  private destroyed$ = new Subject<void>();

  get destroyed() {
    return this.destroyed$.asObservable();
  }

  ngOnDestroy(): void {
    this.destroyed$.next();
    this.destroyed$.complete();
  }
}
