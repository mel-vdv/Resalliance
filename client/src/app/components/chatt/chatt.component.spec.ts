import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChattComponent } from './chatt.component';

describe('ChattComponent', () => {
  let component: ChattComponent;
  let fixture: ComponentFixture<ChattComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ChattComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ChattComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
