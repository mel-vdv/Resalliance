import { TestBed } from '@angular/core/testing';

import { LiaisonEntreCompService } from './liaison-entre-comp.service';

describe('LiaisonEntreCompService', () => {
  let service: LiaisonEntreCompService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LiaisonEntreCompService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
