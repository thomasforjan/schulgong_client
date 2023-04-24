import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddEditRingtonesComponent } from './add-edit-ringtones.component';

describe('AddEditRingtonesComponent', () => {
  let component: AddEditRingtonesComponent;
  let fixture: ComponentFixture<AddEditRingtonesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddEditRingtonesComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddEditRingtonesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
