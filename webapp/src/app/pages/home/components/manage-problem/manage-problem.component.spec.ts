import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageProblemComponent } from './manage-problem.component';

describe('ManageProblemComponent', () => {
  let component: ManageProblemComponent;
  let fixture: ComponentFixture<ManageProblemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ManageProblemComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ManageProblemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
