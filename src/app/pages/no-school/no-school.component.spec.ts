import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NoSchoolComponent } from './no-school.component';

describe('NoSchoolComponent', () => {
  let component: NoSchoolComponent;
  let fixture: ComponentFixture<NoSchoolComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NoSchoolComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NoSchoolComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
