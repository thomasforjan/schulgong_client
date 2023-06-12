import {Component, Inject, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {RingtimeDialog} from '../../../models/Ringtime';
import {ButtonValue, ButtonWidths, HeroImages, StoreService} from '../../../services/store.service';
import {DateUtilsService} from 'src/app/services/date-utils.service';
import {RingtoneBackendService} from "../../../services/ringtone.backend.service";

/**
 * @author: Thomas Forjan, Philipp Wildzeiss, Martin Kral
 * @version: 0.0.2
 * @since: April 2023
 * @description: Add-edit-ringtime component
 */
@Component({
  selector: 'app-add-edit-ringtime',
  templateUrl: './add-edit-ringtime.component.html',
  styleUrls: ['./add-edit-ringtime.component.scss'],
})
export class AddEditRingtimeComponent implements OnInit {
  /**
   * Formgroup of ringtimeForm
   */
  ringtimeForm!: FormGroup;

  /**
   * Boolean to check if the user wants to edit a ringtime
   */
  isEditRingtime = false;

  /**
   * Ringtime Hero image from enum in store service
   */
  ringtimeHeroImage: string = HeroImages.RingtimeHeroImage;

  protected readonly ButtonValue = ButtonValue;
  protected readonly ButtonWidths = ButtonWidths;

  constructor(
    private _ringtoneBackendService: RingtoneBackendService,
    public dateUtilsService: DateUtilsService,
    public dialogRef: MatDialogRef<AddEditRingtimeComponent>,
    public storeService: StoreService,
    @Inject(MAT_DIALOG_DATA)
    public data: {
      isAddRingtime: boolean;
      ringtimeDialog: RingtimeDialog;
      index: string;
    }
  ) {
  }

  ngOnInit() {
    this.loadRingtones();
    this.isEditRingtime = !this.data?.isAddRingtime;
    this.ringtimeForm = new FormGroup(
      {
        id: new FormControl(this.data?.ringtimeDialog?.id),
        name: new FormControl(
          this.data?.ringtimeDialog?.name ?? '',
          Validators.required
        ),
        startDate: new FormControl(
          this.data?.ringtimeDialog
            ? this.dateUtilsService.convertDateTimeToString(
              this.data.ringtimeDialog.startDate,
              'en-CA'
            )
            : '',
          Validators.required
        ),
        endDate: new FormControl(
          this.data?.ringtimeDialog
            ? this.dateUtilsService.convertDateTimeToString(
              this.data.ringtimeDialog.endDate,
              'en-CA'
            )
            : '',
          Validators.required
        ),
        monday: new FormControl(this.data?.ringtimeDialog?.monday ?? ''),
        tuesday: new FormControl(this.data?.ringtimeDialog?.tuesday ?? ''),
        wednesday: new FormControl(this.data?.ringtimeDialog?.wednesday ?? ''),
        thursday: new FormControl(this.data?.ringtimeDialog?.thursday ?? ''),
        friday: new FormControl(this.data?.ringtimeDialog?.friday ?? ''),
        saturday: new FormControl(this.data?.ringtimeDialog?.saturday ?? ''),
        sunday: new FormControl(this.data?.ringtimeDialog?.sunday ?? ''),
        playTime: new FormControl(
          this.data?.ringtimeDialog?.playTime ?? '',
          Validators.required
        ),
        ringtoneId: new FormControl(
          this.data?.ringtimeDialog?.ringtoneId ?? '',
          Validators.required
        ),
      },
      {validators: this.dateUtilsService.dateRangeValidator}
    );
  }

  /**
   * Load ringtones from the database
   */
  loadRingtones() {
    this._ringtoneBackendService.getRingtoneResponse();
  }

  /**
   * Method which is called when the submit button is clicked
   */
  onSubmitClick() {
    if (this.ringtimeForm?.valid) {
      const startDate = new Date(this.ringtimeForm.value.startDate);
      const endDate = new Date(this.ringtimeForm.value.endDate);
      this.ringtimeForm.value.startDate =
        this.dateUtilsService.convertDateTimeToString(startDate, 'en-CA');
      this.ringtimeForm.value.endDate =
        this.dateUtilsService.convertDateTimeToString(endDate, 'en-CA');

      // Check if end date is greater or equal than start date
      const errors = this.dateUtilsService.dateRangeValidator(
        this.ringtimeForm
      );
      if (errors) {
        this.ringtimeForm.setErrors(errors);
        return;
      }

      // If no errors, close dialog
      this.dialogRef.close(this.ringtimeForm.value);
    }
  }

  /**
   * Method which is called when the cancel button is clicked
   */
  onCancelClick() {
    this.dialogRef.close();
  }
}
