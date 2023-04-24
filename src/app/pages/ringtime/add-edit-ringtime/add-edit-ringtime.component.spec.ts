import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddEditRingtimeComponent } from './add-edit-ringtime.component';

describe('AddEditRingtimeComponent', () => {
  let component: AddEditRingtimeComponent;
  let fixture: ComponentFixture<AddEditRingtimeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddEditRingtimeComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddEditRingtimeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
