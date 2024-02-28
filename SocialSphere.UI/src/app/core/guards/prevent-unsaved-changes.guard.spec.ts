import { TestBed } from '@angular/core/testing';

import { PreventUnsavedChangesGuard } from './prevent-unsaved-changes.guard';

describe('PreventUnsavedChangesGuard', () => {
  let guard: typeof PreventUnsavedChangesGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(PreventUnsavedChangesGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
