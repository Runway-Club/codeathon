import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SpinkitComponent } from './spinkit.component';

describe('SpinkitComponent', () => {
  let component: SpinkitComponent;
  let fixture: ComponentFixture<SpinkitComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SpinkitComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SpinkitComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
