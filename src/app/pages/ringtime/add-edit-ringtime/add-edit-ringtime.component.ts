import {Component, Inject} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {BackendService} from "../../../services/backend.service";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {RingTime, RingTimeDialog} from "../../../models/RingTime";
import {HeroImages, StoreService} from "../../../services/store.service";
import {map, tap} from "rxjs";
import {Ringtone} from "../../../models/Ringtone";

@Component({
  selector: 'app-add-edit-ringtime',
  templateUrl: './add-edit-ringtime.component.html',
  styleUrls: ['./add-edit-ringtime.component.scss']
})
export class AddEditRingtimeComponent {
  ringTimeForm!: FormGroup;
  public isEditRingTime = false;
  public isAddRingTime = false;

  /**
   * Dashboard icons from enum in store service
   */
  ringTimeIcon: string[] = Object.values(HeroImages);

  constructor(
    private _backendService: BackendService,
    private _formBuilder: FormBuilder,
    public dialogRef: MatDialogRef<AddEditRingtimeComponent>,
    public storeService: StoreService,
    @Inject(MAT_DIALOG_DATA)
    public data: {isAddRingtime: boolean; ringTimeDialog: RingTimeDialog; index: string},
  ) {
    this.isAddRingTime = data.isAddRingtime;
    this.isEditRingTime = !data.isAddRingtime;
  }

  ngOnInit() {
    this.showResponse();

    if (this.data) {
      console.log(this.data)
      this.isEditRingTime = true;
      this.ringTimeForm = this._formBuilder.group({
        name: [this.data.ringTimeDialog.name, Validators.required],
        startDate: [this.convertDateTimeToString(this.data.ringTimeDialog.startDate, 'en-CA'), Validators.required],
        endDate: [this.convertDateTimeToString(this.data.ringTimeDialog.endDate, 'en-CA')],
        monday: [this.data.ringTimeDialog.monday],
        tuesday: [this.data.ringTimeDialog.tuesday],
        wednesday: [this.data.ringTimeDialog.wednesday],
        thursday: [this.data.ringTimeDialog.thursday],
        friday: [this.data.ringTimeDialog.friday],
        saturday: [this.data.ringTimeDialog.saturday],
        sunday: [this.data.ringTimeDialog.sunday],
        playTime: [this.data.ringTimeDialog.playTime, Validators.required],
        ringToneId: [this.data.ringTimeDialog.ringToneId, Validators.required]
      });
    } else {
      this.isAddRingTime = true;
      this.ringTimeForm = this._formBuilder.group({
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
        ringToneId: ['', Validators.required]
      });
    }
  }

  // Response
  showResponse() {
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


  onSubmitClick() {
    const startDate = new Date(this.ringTimeForm.value.startDate);
    const endDate = new Date(this.ringTimeForm.value.endDate);
    this.ringTimeForm.value.startDate = this.convertDateTimeToString(startDate, 'en-CA');
    this.ringTimeForm.value.endDate = this.convertDateTimeToString(endDate, 'en-CA');
    console.log(this.ringTimeForm.value)
    console.log("SAVE")
    this.dialogRef.close(this.ringTimeForm.value);
  }

  onCancelClick() {
    this.dialogRef.close();
  }

  startDateChange(event: any) {
    this.ringTimeForm.value.startDate = event.target.value;
  }

  endDateChange(event: any) {
    this.ringTimeForm.value.endDate = event.target.value;
  }

  playTimeChange(event: any) {
    this.ringTimeForm.value.playTime = event.target.value;
  }

  convertDateTimeToString(date: Date, locales: string): string {
    let dateString = new Date(date).toLocaleDateString(locales, {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric'
    });
    console.log(dateString)
    return dateString;
  }

  /*ringTimeChange(event: any) {
    this.storeService.ringtoneList$.pipe(
      map((ringtoneList) => ringtoneList.map((ringtone) => {
        if (event === ringtone.id) {
          this.ringTimeForm.value.ringToneDTO = ringtone;
        }
      }))
    );
  }*/

}
