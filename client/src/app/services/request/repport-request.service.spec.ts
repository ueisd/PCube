import { TestBed } from '@angular/core/testing';

import { RepportRequestService } from './repport-request.service';

describe('RepportRequestService', () => {
  let service: RepportRequestService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RepportRequestService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
