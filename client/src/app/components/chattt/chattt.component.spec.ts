import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChatttComponent } from './chattt.component';

describe('ChatttComponent', () => {
  let component: ChatttComponent;
  let fixture: ComponentFixture<ChatttComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ChatttComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ChatttComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
