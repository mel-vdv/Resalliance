import { TestBed } from '@angular/core/testing';

import { MembreClikService } from './membre-clik.service';

describe('MembreClikService', () => {
  let service: MembreClikService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(MembreClikService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
