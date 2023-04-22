import {Component} from '@angular/core';
import {map, Observable, take, tap} from 'rxjs';
import {HeroImages, MenuNames, RoutingLinks, StoreService} from 'src/app/services/store.service';
import {BackendService} from "../../services/backend.service";
import {DatePipe, Time} from '@angular/common'
import {RingTime, RingTimeDialog, RingTimePayload} from "../../models/RingTime";
import {AddEditRingtimeComponent} from "./add-edit-ringtime/add-edit-ringtime.component";
import {MatDialog} from "@angular/material/dialog";
import {MatSnackBar} from "@angular/material/snack-bar";
import {Ringtone} from "../../models/Ringtone";


@Component({
  selector: 'app-ringtime',
  templateUrl: './ringtime.component.html',
  styleUrls: ['./ringtime.component.scss']
})
export class RingtimeComponent {

  ringtimeHeroImage: string = HeroImages.RingtimeHeroImage;

  /**
   * Menu titles from enum in store service
   */
  titles: string[] = Object.values(MenuNames);

  /**
   * Router links from enum in store service
   */
  routerLinks: string[] = Object.values(RoutingLinks);

  /**
   * Dashboard icons from enum in store service
   */
  ringTimeIcon: string[] = Object.values(HeroImages);


  editingRingTimeId: number | null = null;
  matCardParagraph: {} | undefined;
  // cardNumber$ = this.storeService.ringTimeList$.pipe(
  //   map((list) => {
  //     if(list.length > 4) {
  //       return 4;
  //     }else {
  //       return 6;
  //     }
  //   }));
  cardLength$ = this.storeService.ringTimeList$.pipe(
    map((list) => list.length));

  ngOnInit(): void {
    this.showResponse();
  }

  constructor(
    public storeService: StoreService,
    private backendService: BackendService,
    public datepipe: DatePipe,
    private dialog: MatDialog,
    private _snackBar: MatSnackBar,
  ) {
  }

  /**
   * Get the size of the ringTime
   * @returns
   */
  getRingTimeId(): Observable<number[]> {
    return this.storeService.ringTimeList$.pipe(
      map((ringTimeList) => ringTimeList.map((ringTime) => ringTime.id))
    );
  }

  getRingTimeName(): Observable<string[]> {
    return this.storeService.ringTimeList$.pipe(
      map((ringTimeList) => ringTimeList.map((ringTime) => ringTime.name))
    );
  }

  getRingTimeStartDate(): Observable<string[]> {
    return this.storeService.ringTimeList$.pipe(
      map((ringTimeList) => ringTimeList.map((ringTime) => {
        return ringTime.startDate.toLocaleString()
      }))
    );
  }

  getRingTimeEndDate(): Observable<Date[]> {
    return this.storeService.ringTimeList$.pipe(
      map((ringTimeList) => ringTimeList.map((ringTime) => ringTime.endDate))
    );
  }

  getRingTimeStartAndEndDateAsString(): Observable<string[]> {
    return this.storeService.ringTimeList$.pipe(
      map((ringTimeList) => ringTimeList.map((ringTime) => {
        const startDate = new Date(ringTime.startDate);
        const endDate = new Date(ringTime.endDate);
        const formattedStartDate = startDate.toLocaleDateString('de-DE', {
          day: '2-digit',
          month: '2-digit',
          year: 'numeric'
        });
        const formattedEndDate = endDate.toLocaleDateString('de-DE', {
          day: '2-digit',
          month: '2-digit',
          year: 'numeric'
        });
        return `${formattedStartDate} - ${formattedEndDate}`;
      }))
    );
  }

  getRingToneName(): Observable<string[]> {
    return this.storeService.ringTimeList$.pipe(
      map((ringTimeList) => ringTimeList.map((ringTime) => ringTime.ringToneDTO.name))
    );
  }

  getRingTimePlayTime(): Observable<Time[]> {
    return this.storeService.ringTimeList$.pipe(
      map((ringTimeList) => ringTimeList.map((ringTime) => ringTime.playTime))
    );
  }

  getRingTimePlayTimeAsString(): Observable<string[]> {
    return this.storeService.ringTimeList$.pipe(
      map((ringTimeList) => ringTimeList.map((ringTime) => {
        const playTime = ringTime.playTime;
        const unit = "Uhr"
        return `${playTime} ${unit}`;
      }))
    );
  }

  getRingTimeMonday(): Observable<boolean[]> {
    return this.storeService.ringTimeList$.pipe(
      map((ringTimeList) => ringTimeList.map((ringTime) => ringTime.monday))
    );
  }

  getRingTimeTuesday(): Observable<boolean[]> {
    return this.storeService.ringTimeList$.pipe(
      map((ringTimeList) => ringTimeList.map((ringTime) => ringTime.tuesday))
    );
  }

  getRingTimeWednesday(): Observable<boolean[]> {
    return this.storeService.ringTimeList$.pipe(
      map((ringTimeList) => ringTimeList.map((ringTime) => ringTime.wednesday))
    );
  }

  getRingTimeThursday(): Observable<boolean[]> {
    return this.storeService.ringTimeList$.pipe(
      map((ringTimeList) => ringTimeList.map((ringTime) => ringTime.thursday))
    );
  }

  getRingTimeFriday(): Observable<boolean[]> {
    return this.storeService.ringTimeList$.pipe(
      map((ringTimeList) => ringTimeList.map((ringTime) => ringTime.friday))
    );
  }

  getRingTimeSaturday(): Observable<boolean[]> {
    return this.storeService.ringTimeList$.pipe(
      map((ringTimeList) => ringTimeList.map((ringTime) => ringTime.saturday))
    );
  }

  getRingTimeSunday(): Observable<boolean[]> {
    return this.storeService.ringTimeList$.pipe(
      map((ringTimeList) => ringTimeList.map((ringTime) => ringTime.sunday))
    );
  }

  /*getRingTimeAddInfo(): Observable<string[]> {
    return this.storeService.ringTimeList$.pipe(
      map((ringTimeList) => ringTimeList.map((ringTime) => ringTime.addInfo))
    );
  }*/

  getWeekDaysAsString(): Observable<string[]> {
    return this.storeService.ringTimeList$.pipe(
      map((ringTimeList) => ringTimeList.map((ringTime) => {
        const weekDays = this.getWeekDaysFromOneRingTimeAsString(ringTime);
        return `${weekDays}`;
      }))
    );
  }

  getWeekDaysFromOneRingTimeAsString(ringTime: RingTime) {
    let weekDays: string[] = []

    if (ringTime.monday) {
      weekDays.push("MO")
    }
    if (ringTime.tuesday) {
      weekDays.push("DI")
    }
    if (ringTime.wednesday) {
      weekDays.push("MI")
    }
    if (ringTime.thursday) {
      weekDays.push("DO")
    }
    if (ringTime.friday) {
      weekDays.push("FR")
    }
    if (ringTime.saturday) {
      weekDays.push("SA")
    }
    if (ringTime.sunday) {
      weekDays.push("SO")
    }
    return weekDays.join(", ")
  }


  /**
   * Method which is called when the edit button is clicked
   * @param index index of the ringTime
   */
  onEditRingTime(index: number) {
    this.storeService.ringTimeList$.pipe(
      take(1)).subscribe((ringTimeList) => {
      this.openDialogEditRingTime(ringTimeList[index], index);
    })
  }

  getRingTime(index: number) {
    return this.storeService.ringTimeList$.pipe(
      take(1)).subscribe((ringTimeList) => {
      return ringTimeList[index].id;
    })
  }

  /*
    /!**
     * Method which is called when the delete button is clicked
     * @param index index of the ringTime
     *!/
    onDeleteRingTime(index: number) {
      const ringTime = this.getRingTime(index);
      console.log('Delete ringTime:', ringTime);
    }*/

  // Response
  showResponse() {
    this.backendService
      .getRingTimeResponse()
      .pipe(
        tap((response) => {
          if (
            response.body &&
            response.body._embedded &&
            response.body._embedded.ringTimeDTOList

          ) {
            const ringTimeList = response.body._embedded.ringTimeDTOList;
            this.storeService.updateRingTimeList(ringTimeList);
          }
        })
      )
      .subscribe();
  }

  // Delete
  onDeleteRingTime(index: number): void {
    index = this.getRealId(index)
    this.backendService.deleteRingTimeResource(index)
      .subscribe(() => {
        this.storeService.ringTimeList$.pipe(take(1)).subscribe((ringTimeList) => {
          const updatedRingTimeList = ringTimeList.filter((ringTime) => ringTime.id !== index);
          this.storeService.updateRingTimeList(updatedRingTimeList);
        });
      });
  }

  // transform shown number into real id of object
  getRealId(index: number) {
    this.storeService.ringTimeList$.pipe(
      take(1)).subscribe((ringTimeList) => {
      index = ringTimeList[index].id;
    })
    return index
  }

  /**
   * Opens a Modal-Dialog for add and updating a ringTime
   * @param ringTime updated ringTime object
   * @param edit add/edit mode
   */
  openDialogEditRingTime(ringTime: RingTime, index: number) {
    let ringTimeDialog = this.createDialogResultFromRingTime(ringTime)
    const dialogRef = this.dialog.open(AddEditRingtimeComponent, {
      width: '500px',
      height: '720px',
      data: { isAddRingtone: false, ringTimeDialog, index },
    });
    dialogRef.afterClosed().subscribe((result: RingTimeDialog) => {
      if (result) {
        console.log("AFTER CLOSED")
        console.log(result)
        this.convertDialogResultIntoRingTime(result, ringTime)

        ringTime.ringToneDTO = this.getRingToneDTOById(result.ringToneId);

        this.backendService.updateRingTimeResource(ringTime).subscribe((response) => {
          const updatedRingTime = response.body;
          if (updatedRingTime) {
            this.storeService.ringTimeList$
              .pipe(take(1))
              .subscribe((currentRingTimeList) => {
                const updatedList = currentRingTimeList.map((ringTime) =>
                  ringTime.id === updatedRingTime.id ? updatedRingTime : ringTime
                );
                this.storeService.updateRingTimeList(updatedList);
              });
          }
        });

        this._snackBar.open(
          `Klingelzeit ${ringTime.name} wird aktualisieriert`,
          'Ok',
          {
            horizontalPosition: 'end',
            verticalPosition: 'bottom',
            duration: 2000,
          }
        );
      }
    });
  }

  openDialogAddRingTime() {
    let ringTime: RingTimePayload;
    const dialogRef = this.dialog.open(AddEditRingtimeComponent, {
      width: '500px',
      height: '720px',
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        console.log("SAVE ADD")
        console.log(result)
        let ringTone = this.getRingToneDTOById(result.ringToneId);
        ringTime = this.createRingTimePayloadFromDialogResult(result, ringTone);
        console.log("RINGTIME")
        console.log(ringTime)
        this.backendService.postRingTimeRequest(ringTime).subscribe((response)=>{
          const newRingtone = response.body;
          if (newRingtone){
            this.storeService.ringTimeList$
              .pipe(take(1))
              .subscribe((currentRingtoneList) => {
                const updatedList = [...currentRingtoneList, newRingtone];
                this.storeService.updateRingTimeList(updatedList);
              });
          }
        });

        this._snackBar.open('Klingelzeit wird hinzugefügt', 'Ok', {
          horizontalPosition: 'end',
          verticalPosition: 'bottom',
          duration: 2000,
        });
      }
    });
  }

  convertDialogResultIntoRingTime(result: RingTimeDialog, ringTime: RingTime) {
    ringTime.id = result.id;
    ringTime.name = result.name;
    ringTime.startDate = result.startDate;
    ringTime.endDate = result.endDate;
    ringTime.playTime = result.playTime;
    ringTime.monday = result.monday;
    ringTime.tuesday = result.tuesday;
    ringTime.wednesday = result.wednesday;
    ringTime.thursday = result.thursday;
    ringTime.friday = result.friday;
    ringTime.saturday = result.saturday;
    ringTime.sunday = result.sunday;
  }

  createDialogResultFromRingTime(ringTime: RingTime) {
    return {
      id: ringTime.id,
      name: ringTime.name,
      ringToneId: ringTime.ringToneDTO.id,
      startDate: ringTime.startDate,
      endDate: ringTime.endDate,
      playTime: ringTime.playTime,
      monday: ringTime.monday,
      tuesday: ringTime.tuesday,
      wednesday: ringTime.wednesday,
      thursday: ringTime.thursday,
      friday: ringTime.friday,
      saturday: ringTime.saturday,
      sunday: ringTime.sunday
    }
  }

  createRingTimePayloadFromDialogResult(ringTimeDialog: RingTimeDialog, ringtone: Ringtone) {
    let ringToneOnlyId = {
      id: ringTimeDialog.ringToneId
    }
    return {
      name: ringTimeDialog.name,
      ringToneDTO: ringToneOnlyId,
      startDate: ringTimeDialog.startDate,
      endDate: ringTimeDialog.endDate,
      playTime: ringTimeDialog.playTime,
      monday: ringTimeDialog.monday ? true : false,
      tuesday: ringTimeDialog.tuesday ? true : false,
      wednesday: ringTimeDialog.wednesday ? true : false,
      thursday: ringTimeDialog.thursday ? true : false,
      friday: ringTimeDialog.friday ? true : false,
      saturday: ringTimeDialog.saturday ? true : false,
      sunday: ringTimeDialog.sunday ? true : false
    }
  }

  getRingToneDTOById(ringToneId: number) {
    let ringTone!: Ringtone;
    this.storeService.ringtoneList$.pipe(
      take(1)).subscribe((ringtoneList) => {
      for (let i = 0; i < ringtoneList.length; i++) {
        if (ringtoneList[i].id === ringToneId) {
          ringTone =  ringtoneList[i];
        }
      }
    });
    return ringTone;
  }
}
