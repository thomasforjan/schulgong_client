import {Component, Inject, OnInit} from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Holiday, HolidayPayload } from 'src/app/models/Holiday';
import { DateUtilsService } from 'src/app/services/date-utils.service';
import { HeroImages } from 'src/app/services/store.service';

/**
 * @author: Thomas Forjan, Philipp Wildzeiss, Martin Kral
 * @version: 0.0.2
 * @since: May 2023
 * @description: Add-edit-holiday component
 */
@Component({
  selector: 'app-add-edit-holidays',
  templateUrl: './add-edit-holidays.component.html',
  styleUrls: ['./add-edit-holidays.component.scss'],
})
export class AddEditHolidaysComponent implements OnInit{
  /**
   * Ringtones Hero Image, enum is in store service
   */
  holidaysHeroImage: string = HeroImages.HolidayHeroImage;

  /**
   * Formgroup of holidayForm
   */
  holidayForm!: FormGroup;

  /**
   * Boolean to check if the user wants to edit a holiday
   */
  isEditHoliday: boolean;

  constructor(
    public dateUtilsService: DateUtilsService,
    public dialogRef: MatDialogRef<AddEditHolidaysComponent>,
    @Inject(MAT_DIALOG_DATA)
    public data: {
      isAddHoliday: boolean;
      holiday?: Holiday;
      index?: number;
    }
  ) {
    this.isEditHoliday = !data.isAddHoliday;
  }

  ngOnInit(): void {
    this.holidayForm = new FormGroup(
      {
        holidayDescriptionFormControl: new FormControl(
          this.data.holiday?.name || '',
          Validators.required
        ),
        startDate: new FormControl(
          this.data.holiday?.startDate || '',
          Validators.required
        ),
        endDate: new FormControl(
          this.data.holiday?.endDate || '',
          Validators.required
        ),
      },
      { validators: this.dateUtilsService.dateRangeValidator }
    );
  }

  /**
   * Method which is called when the submit button is clicked
   */
  onSubmitClick() {
    if (this.holidayForm?.valid) {
      const holidayPayload: HolidayPayload = {
        name: this.holidayForm.value.holidayDescriptionFormControl,
        startDate: this.dateUtilsService.convertStringToDateTime(
          new Date(this.holidayForm.value.startDate),
          'en-CA'
        ),
        endDate: this.dateUtilsService.convertStringToDateTime(
          new Date(this.holidayForm.value.endDate),
          'en-CA'
        ),
      };
      this.dialogRef.close(holidayPayload);
    }
  }

  /**
   * Method which is called when the cancel button is clicked
   */
  onCancelClick() {
    this.dialogRef.close();
  }
}
