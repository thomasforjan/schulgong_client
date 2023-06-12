import {Component, Inject, OnInit} from '@angular/core';
import {AbstractControl, FormControl, FormGroup, ValidatorFn, Validators} from '@angular/forms';
import {ButtonValue, ButtonWidths, HeroImages, StoreService} from '../../../services/store.service';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {Ringtone} from 'src/app/models/Ringtone';

/**
 * @author: Thomas Forjan, Philipp Wildzeiss, Martin Kral
 * @version: 0.0.2
 * @since: April 2023
 * @description: Add-edit-ringtone component
 */
@Component({
  selector: 'app-add-edit-ringtones',
  templateUrl: './add-edit-ringtones.component.html',
  styleUrls: ['./add-edit-ringtones.component.scss'],
})
export class AddEditRingtonesComponent implements OnInit {
  /**
   * Ringtones Hero Image, enum is in store service
   */
  ringtonesHeroImage: string = HeroImages.RingtonesHeroImage;

  protected readonly ButtonValue = ButtonValue;
  protected readonly ButtonWidths = ButtonWidths;

  /**
   * Formgroup of ringtoneForm
   */
  ringtoneForm!: FormGroup;

  /**
   * Boolean to check if the user wants to edit a ringtone
   */
  isEditRingtone: boolean;

  /**
   * Save the uploaded File
   */
  ringtoneFile: File | null = null;

  name: string | undefined;

  constructor(
    public dialogRef: MatDialogRef<AddEditRingtonesComponent>,
    @Inject(MAT_DIALOG_DATA)
    public data: {
      isAddRingtone: boolean;
      ringtone?: Ringtone;
      index?: number;
    },
    public storeService: StoreService,
  ) {
    this.isEditRingtone = !data.isAddRingtone;
    this.name = data.ringtone?.name;
  }

  ngOnInit(): void {
    if (this.data) {
      this.ringtoneForm = new FormGroup({
        ringtoneDescriptionFormControl: new FormControl(
          this.data.ringtone?.name || '',
          [Validators.required, this.alarmNameValidator()]
        ),
        uploadedRingtoneFormControl: new FormControl(
          this.data.ringtone?.filename || '',
          this.data.isAddRingtone ? Validators.required : null
        ),
      });
    } else {
      this.ringtoneForm = new FormGroup({
        ringtoneDescriptionFormControl: new FormControl(
          '',
          [Validators.required, this.alarmNameValidator()]
        ),
        uploadedRingtoneFormControl: new FormControl('', Validators.required),
      });
    }
  }

  /**
   * Method which is called when the submit button is clicked
   */
  onSubmitClick() {
    if (this.ringtoneForm?.valid) {
      const formData = new FormData();
      if (this.ringtoneFile) {
        formData.append('song', this.ringtoneFile, this.ringtoneFile.name);
      }
      formData.append(
        'name',
        this.ringtoneForm.value.ringtoneDescriptionFormControl
      );
      formData.append('date', new Date().toISOString());
      if (this.ringtoneFile) {
        formData.append('size', this.ringtoneFile.size.toString());
      }
      this.dialogRef.close(formData);
    }
  }

  /**
   * Method which is called when the upload button is clicked
   */
  onUploadRingtone() {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'audio/*';
    input.onchange = (onChangeEvent: any) => {
      const file = <File>onChangeEvent.target.files[0];
      if (file && file.type.startsWith('audio/')) {
        this.ringtoneFile = file;
        this.ringtoneForm.patchValue({
          uploadedRingtoneFormControl: file.name,
        });
      } else {
        console.error('Selected file is not an audio file');
      }
    };
    input.click();
  }

  /**
   * Method which is called when the cancel button is clicked
   */
  onCancelClick() {
    this.dialogRef.close();
  }

  /**
   * @description Validates whether the name of the ringtone is alarm.
   * @returns An object with an alarmName property if the name is alarm; otherwise, null.
   */
  alarmNameValidator(): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {
      const forbidden = control.value.toLowerCase() === 'alarm';
      if(forbidden && this.name != control.value) {
        return  { alarmName: { value: control.value } };
      }
      return null;
    };
  }
}
