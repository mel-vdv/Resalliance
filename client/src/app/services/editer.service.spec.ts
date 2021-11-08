import { TestBed } from '@angular/core/testing';

import { EditerService } from './editer.service';

describe('EditerService', () => {
  let service: EditerService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(EditerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
