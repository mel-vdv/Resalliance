import { TestBed } from '@angular/core/testing';

import { Ws2Service } from './ws2.service';

describe('Ws2Service', () => {
  let service: Ws2Service;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Ws2Service);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
