import {Component, Inject, OnInit} from '@angular/core';
import {FormControl, FormGroup, Validators} from '@angular/forms';
import {HeroImages} from '../../../services/store.service';
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

  constructor(
    public dialogRef: MatDialogRef<AddEditRingtonesComponent>,
    @Inject(MAT_DIALOG_DATA)
    public data: {
      isAddRingtone: boolean;
      ringtone?: Ringtone;
      index?: number;
    }
  ) {
    this.isEditRingtone = !data.isAddRingtone;
  }

  ngOnInit(): void {
    if (this.data) {
      this.ringtoneForm = new FormGroup({
        ringtoneDescriptionFormControl: new FormControl(
          this.data.ringtone?.name || '',
          this.data.isAddRingtone ? Validators.required : null
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
          Validators.required
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
}
