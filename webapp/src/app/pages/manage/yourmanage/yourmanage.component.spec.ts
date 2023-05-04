import { ComponentFixture, TestBed } from '@angular/core/testing';

import { YourmanageComponent } from './yourmanage.component';

describe('YourmanageComponent', () => {
  let component: YourmanageComponent;
  let fixture: ComponentFixture<YourmanageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ YourmanageComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(YourmanageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
