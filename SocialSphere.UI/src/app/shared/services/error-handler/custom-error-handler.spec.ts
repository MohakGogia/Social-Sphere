import { TestBed } from '@angular/core/testing';

import { CustomErrorHandler } from './custom-error-handler';

describe('CustomErrorHandler', () => {
  let service: CustomErrorHandler;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CustomErrorHandler);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
