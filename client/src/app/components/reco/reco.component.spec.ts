import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RecoComponent } from './reco.component';

describe('RecoComponent', () => {
  let component: RecoComponent;
  let fixture: ComponentFixture<RecoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RecoComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RecoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
