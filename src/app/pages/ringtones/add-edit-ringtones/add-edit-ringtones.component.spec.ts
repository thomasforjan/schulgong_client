import {ComponentFixture, TestBed} from '@angular/core/testing';

import {AddEditRingtonesComponent} from './add-edit-ringtones.component';
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {HeroImageComponent} from "../../../components/hero-image/hero-image.component";
import {MatFormFieldModule} from "@angular/material/form-field";
import {ButtonComponent} from "../../../components/button/button.component";
import {ReactiveFormsModule} from "@angular/forms";
import {MatInputModule} from "@angular/material/input";
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";
import {MatTooltipModule} from "@angular/material/tooltip";
import {MatIconModule} from "@angular/material/icon";

/**
 * @author: Thomas Forjan, Philipp Wildzeiss, Martin Kral
 * @version: 0.0.2
 * @since: April 2023
 * @description: Tests for the add-edit-ringtone component
 */
describe('AddEditRingtonesComponent', () => {
  let component: AddEditRingtonesComponent;
  let fixture: ComponentFixture<AddEditRingtonesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AddEditRingtonesComponent, HeroImageComponent, ButtonComponent],
      imports: [MatFormFieldModule, ReactiveFormsModule, MatInputModule, BrowserAnimationsModule, MatTooltipModule, MatIconModule],
      providers: [{provide: MatDialogRef, useValue: {}}, {provide: MAT_DIALOG_DATA, useValue: {}}]
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
