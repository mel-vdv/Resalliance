import { TestBed } from '@angular/core/testing';

import { LienService } from './lien.service';

describe('LienService', () => {
  let service: LienService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LienService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
