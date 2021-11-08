import { TestBed } from '@angular/core/testing';

import { AdresseMailService } from './adresse-mail.service';

describe('AdresseMailService', () => {
  let service: AdresseMailService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AdresseMailService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
