import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BoiteComponent } from './boite.component';

describe('BoiteComponent', () => {
  let component: BoiteComponent;
  let fixture: ComponentFixture<BoiteComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BoiteComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BoiteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
