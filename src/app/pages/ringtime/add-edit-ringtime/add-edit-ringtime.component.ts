import {Component, Inject} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {BackendService} from "../../../services/backend.service";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {Ringtime, RingtimeDialog} from "../../../models/Ringtime";
import {HeroImages, StoreService} from "../../../services/store.service";
import {map, tap} from "rxjs";

/**
 - author: Thomas Forjan, Philipp Wildzeiss, Martin Kral
 - version: 0.0.1
 - date: 12.04.2023
 - description: Ringtime component
 */
@Component({
  selector: 'app-add-edit-ringtime',
  templateUrl: './add-edit-ringtime.component.html',
  styleUrls: ['./add-edit-ringtime.component.scss']
})
export class AddEditRingtimeComponent {
  /**
   * Formgroup of ringtimeForm
   */
  ringtimeForm!: FormGroup;

  /**
   * Boolean to check if the user wants to edit a ringtime
   */
  public isEditRingtime = false;

  /**
   * Boolean to check if the user wants to add a new ringtime
   */
  public isAddRingtime = false;

  /**
   * Dashboard icons from enum in store service
   */
  ringtimeIcon: string[] = Object.values(HeroImages);

  constructor(
    private _backendService: BackendService,
    private _formBuilder: FormBuilder,
    public dialogRef: MatDialogRef<AddEditRingtimeComponent>,
    public storeService: StoreService,
    @Inject(MAT_DIALOG_DATA)
    public data: {isAddRingtime: boolean; ringtimeDialog: RingtimeDialog; index: string},
  ) {
    if (this.data) {
      this.isAddRingtime = data.isAddRingtime;
      this.isEditRingtime = !data.isAddRingtime;
    }
  }

  ngOnInit() {
    this.loadRingtones();

    if (this.data) {
      console.log(this.data)
      this.isEditRingtime = true;
      this.ringtimeForm = this._formBuilder.group({
        id: [this.data.ringtimeDialog.id],
        name: [this.data.ringtimeDialog.name],
        startDate: [this.convertDateTimeToString(this.data.ringtimeDialog.startDate, 'en-CA'), Validators.required],
        endDate: [this.convertDateTimeToString(this.data.ringtimeDialog.endDate, 'en-CA')],
        monday: [this.data.ringtimeDialog.monday],
        tuesday: [this.data.ringtimeDialog.tuesday],
        wednesday: [this.data.ringtimeDialog.wednesday],
        thursday: [this.data.ringtimeDialog.thursday],
        friday: [this.data.ringtimeDialog.friday],
        saturday: [this.data.ringtimeDialog.saturday],
        sunday: [this.data.ringtimeDialog.sunday],
        playTime: [this.data.ringtimeDialog.playTime, Validators.required],
        ringtoneId: [this.data.ringtimeDialog.ringtoneId, Validators.required]
      });
    } else {
      this.isAddRingtime = true;
      this.ringtimeForm = this._formBuilder.group({
        name: ['', Validators.required],
        startDate: ['', Validators.required],
        endDate: [''],
        monday: [''],
        tuesday: [''],
        wednesday: [''],
        thursday: [''],
        friday: [''],
        saturday: [''],
        sunday: [''],
        playTime: ['', Validators.required],
        ringtoneId: ['', Validators.required]
      });
    }
  }

  /**
   * Load ringtones from the database
   */
  loadRingtones() {
    this._backendService
      .getRingtoneResponse()
      .pipe(
        tap((response) => {
          if (
            response.body &&
            response.body._embedded &&
            response.body._embedded.ringtoneDTOList

          ) {
            const ringtoneList = response.body._embedded.ringtoneDTOList;
            this.storeService.updateRingtoneList(ringtoneList);
          }
        })
      )
      .subscribe();
  }

  /**
   * Method which is called when the submit button is clicked
   */
  onSubmitClick() {
    if(this.ringtimeForm?.valid) {
      const startDate = new Date(this.ringtimeForm.value.startDate);
      const endDate = new Date(this.ringtimeForm.value.endDate);
      this.ringtimeForm.value.startDate = this.convertDateTimeToString(startDate, 'en-CA');
      this.ringtimeForm.value.endDate = this.convertDateTimeToString(endDate, 'en-CA');
      this.dialogRef.close(this.ringtimeForm.value);
    }
  }

  /**
   * Method which is called when the cancel button is clicked
   */
  onCancelClick() {
    this.dialogRef.close();
  }

  /**
   * Method which is called when the start date is changed
   */
  startDateChange(event: any) {
    this.ringtimeForm.value.startDate = event.target.value;
  }

  /**
   * Method which is called when the end date is changed
   */
  endDateChange(event: any) {
    this.ringtimeForm.value.endDate = event.target.value;
  }

  /**
   * Method which is called when the playtime is changed
   */
  playTimeChange(event: any) {
    this.ringtimeForm.value.playTime = event.target.value;
  }

  /**
   * Converts date time to string
   */
  convertDateTimeToString(date: Date, locales: string): string {
    let dateString = new Date(date).toLocaleDateString(locales, {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
    console.log(dateString)
    return dateString;
  }

}
