import { TestBed } from '@angular/core/testing';

import { EnvTestService } from './envtest.service';

describe('TestService', () => {
  let service: EnvTestService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EnvTestService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
