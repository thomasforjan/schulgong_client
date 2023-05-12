import {ComponentFixture, TestBed} from '@angular/core/testing';

import {AddEditRingtimeComponent} from './add-edit-ringtime.component';
import {HttpClientTestingModule} from "@angular/common/http/testing";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {HeroImageComponent} from "../../../components/hero-image/hero-image.component";
import {ReactiveFormsModule} from "@angular/forms";
import {MatFormFieldModule} from "@angular/material/form-field";
import {MatDatepickerModule} from "@angular/material/datepicker";
import {MatNativeDateModule} from "@angular/material/core";
import {ButtonComponent} from "../../../components/button/button.component";
import {MatCheckboxModule} from "@angular/material/checkbox";
import {MatSelectModule} from "@angular/material/select";
import {MatInputModule} from "@angular/material/input";
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";
import {MatTooltipModule} from "@angular/material/tooltip";
import {MatIconModule} from "@angular/material/icon";

/**
 * @author: Thomas Forjan, Philipp Wildzeiss, Martin Kral
 * @version: 0.0.2
 * @since: April 2023
 * @description: Tests for the add-edit-ringtime component
 */
describe('AddEditRingtimeComponent', () => {
  let component: AddEditRingtimeComponent;
  let fixture: ComponentFixture<AddEditRingtimeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AddEditRingtimeComponent, HeroImageComponent, ButtonComponent],
      imports: [HttpClientTestingModule, ReactiveFormsModule, MatFormFieldModule, MatDatepickerModule,
        MatNativeDateModule, MatCheckboxModule, MatSelectModule, MatInputModule, BrowserAnimationsModule, MatTooltipModule,
        MatIconModule],
      providers: [{provide: MatDialogRef, useValue: {}}, {provide: MAT_DIALOG_DATA, useValue: {}}]
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
