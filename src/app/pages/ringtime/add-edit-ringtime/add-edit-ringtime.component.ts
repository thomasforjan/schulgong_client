import {Component, Inject} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {BackendService} from "../../../services/backend.service";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {Ringtime, RingtimeDialog} from "../../../models/Ringtime";
import {HeroImages, StoreService} from "../../../services/store.service";
import {map, tap} from "rxjs";
import {Ringtone} from "../../../models/Ringtone";

@Component({
  selector: 'app-add-edit-ringtime',
  templateUrl: './add-edit-ringtime.component.html',
  styleUrls: ['./add-edit-ringtime.component.scss']
})
export class AddEditRingtimeComponent {
  ringtimeForm!: FormGroup;
  public isEditRingtime = false;
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
    this.showResponse();

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
    const startDate = new Date(this.ringtimeForm.value.startDate);
    const endDate = new Date(this.ringtimeForm.value.endDate);
    this.ringtimeForm.value.startDate = this.convertDateTimeToString(startDate, 'en-CA');
    this.ringtimeForm.value.endDate = this.convertDateTimeToString(endDate, 'en-CA');
    console.log(this.ringtimeForm.value)
    console.log("SAVE")
    this.dialogRef.close(this.ringtimeForm.value);
  }

  onCancelClick() {
    this.dialogRef.close();
  }

  startDateChange(event: any) {
    this.ringtimeForm.value.startDate = event.target.value;
  }

  endDateChange(event: any) {
    this.ringtimeForm.value.endDate = event.target.value;
  }

  playTimeChange(event: any) {
    this.ringtimeForm.value.playTime = event.target.value;
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
