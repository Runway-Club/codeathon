import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewproblemComponent } from './newproblem.component';

describe('NewproblemComponent', () => {
  let component: NewproblemComponent;
  let fixture: ComponentFixture<NewproblemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NewproblemComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NewproblemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
