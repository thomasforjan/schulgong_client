import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AddEditRingtonesComponent } from './add-edit-ringtones.component';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { HeroImageComponent } from '../../../components/hero-image/hero-image.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { ButtonComponent } from '../../../components/button/button.component';
import { ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatIconModule } from '@angular/material/icon';

/**
 * @author: Thomas Forjan, Philipp Wildzeiss, Martin Kral
 * @version: 0.0.2
 * @since: April 2023
 * @description: Tests for the add-edit-ringtone component
 */

/**
 * @description
 * Suite of tests for the AddEditRingtonesComponent
 */
describe('AddEditRingtonesComponent', () => {
  let component: AddEditRingtonesComponent;
  let fixture: ComponentFixture<AddEditRingtonesComponent>;
  let dialogRefSpy: jasmine.SpyObj<MatDialogRef<AddEditRingtonesComponent>>;

  beforeEach(async () => {
    const spy = jasmine.createSpyObj('MatDialogRef', ['close']);

    await TestBed.configureTestingModule({
      declarations: [
        AddEditRingtonesComponent,
        HeroImageComponent,
        ButtonComponent,
      ],
      imports: [
        MatFormFieldModule,
        ReactiveFormsModule,
        MatInputModule,
        BrowserAnimationsModule,
        MatTooltipModule,
        MatIconModule,
      ],
      providers: [
        { provide: MatDialogRef, useValue: spy },
        { provide: MAT_DIALOG_DATA, useValue: {} },
      ],
    }).compileComponents();

    dialogRefSpy = TestBed.inject(MatDialogRef) as jasmine.SpyObj<
      MatDialogRef<AddEditRingtonesComponent>
    >;

    fixture = TestBed.createComponent(AddEditRingtonesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  /**
   * @description Check if the AddEditRingtonesComponent has been created successfully
   */
  it('should create', () => {
    expect(component).toBeTruthy();
  });

  /**
   * @description Test if the dialog closes when onCancelClick() method is invoked
   */
  it('should close dialog on cancel', () => {
    component.onCancelClick();

    expect(dialogRefSpy.close.calls.count()).toBe(
      1,
      'spy method was called once'
    );
  });

  /**
   * @description Test if the form validation works correctly
   */
  it('should validate form', () => {
    // Initially form should be invalid
    expect(component.ringtoneForm.valid).toBeFalsy();

    let control = component.ringtoneForm.get('ringtoneDescriptionFormControl');
    control?.setValue('Test');
    control = component.ringtoneForm.get('uploadedRingtoneFormControl');
    control?.setValue('TestFile.mp3');

    // Now form should be valid
    expect(component.ringtoneForm.valid).toBeTruthy();
  });

  /**
   * @description Test if alarm name is validated correctly
   */
  it('should validate alarm name', () => {
    let control = component.ringtoneForm.get('ringtoneDescriptionFormControl');
    control?.setValue('Alarm');
    expect(control?.invalid).toBeTruthy();
  });
});
