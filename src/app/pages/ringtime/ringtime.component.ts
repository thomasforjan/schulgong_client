import {Component} from '@angular/core';
import {map, Observable, take, tap} from 'rxjs';
import {HeroImages, MenuNames, RoutingLinks, StoreService} from 'src/app/services/store.service';
import {BackendService} from "../../services/backend.service";
import {DatePipe, Time} from '@angular/common'
import {Ringtime, RingtimeDialog, RingtimePayload} from "../../models/Ringtime";
import {AddEditRingtimeComponent} from "./add-edit-ringtime/add-edit-ringtime.component";
import {MatDialog} from "@angular/material/dialog";
import {MatSnackBar} from "@angular/material/snack-bar";
import {Ringtone} from "../../models/Ringtone";
import {DeleteDialogComponent} from "../../components/delete-dialog/delete-dialog.component";


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
  ringtimeIcon: string[] = Object.values(HeroImages);


  editingRingtimeId: number | null = null;
  matCardParagraph: {} | undefined;
  cardLength$ = this.storeService.ringtimeList$.pipe(
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
  getRingtimeId(): Observable<number[]> {
    return this.storeService.ringtimeList$.pipe(
      map((ringtimeList) => ringtimeList.map((ringtime) => ringtime.id))
    );
  }

  getRingtimeName(): Observable<string[]> {
    return this.storeService.ringtimeList$.pipe(
      map((ringtimeList) => ringtimeList.map((ringtime) => ringtime.name))
    );
  }

  getRingtimeStartDate(): Observable<string[]> {
    return this.storeService.ringtimeList$.pipe(
      map((ringtimeList) => ringtimeList.map((ringtime) => {
        return ringtime.startDate.toLocaleString()
      }))
    );
  }

  getRingtimeEndDate(): Observable<Date[]> {
    return this.storeService.ringtimeList$.pipe(
      map((ringtimeList) => ringtimeList.map((ringtime) => ringtime.endDate))
    );
  }

  getRingtimeStartAndEndDateAsString(): Observable<string[]> {
    return this.storeService.ringtimeList$.pipe(
      map((ringtimeList) => ringtimeList.map((ringtime) => {
        const startDate = new Date(ringtime.startDate);
        const endDate = new Date(ringtime.endDate);
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

  getRingtoneName(): Observable<string[]> {
    return this.storeService.ringtimeList$.pipe(
      map((ringtimeList) => ringtimeList.map((ringtime) => ringtime.ringtoneDTO.name))
    );
  }

  getRingtimePlayTime(): Observable<Time[]> {
    return this.storeService.ringtimeList$.pipe(
      map((ringtimeList) => ringtimeList.map((ringtime) => ringtime.playTime))
    );
  }

  getRingtimePlayTimeAsString(): Observable<string[]> {
    return this.storeService.ringtimeList$.pipe(
      map((ringtimeList) => ringtimeList.map((ringtime) => {
        const playTime = ringtime.playTime;
        const unit = "Uhr"
        return `${playTime} ${unit}`;
      }))
    );
  }

  getRingtimeMonday(): Observable<boolean[]> {
    return this.storeService.ringtimeList$.pipe(
      map((ringtimeList) => ringtimeList.map((ringtime) => ringtime.monday))
    );
  }

  getRingtimeTuesday(): Observable<boolean[]> {
    return this.storeService.ringtimeList$.pipe(
      map((ringtimeList) => ringtimeList.map((ringtime) => ringtime.tuesday))
    );
  }

  getRingtimeWednesday(): Observable<boolean[]> {
    return this.storeService.ringtimeList$.pipe(
      map((ringtimeList) => ringtimeList.map((ringtime) => ringtime.wednesday))
    );
  }

  getRingtimeThursday(): Observable<boolean[]> {
    return this.storeService.ringtimeList$.pipe(
      map((ringtimeList) => ringtimeList.map((ringtime) => ringtime.thursday))
    );
  }

  getRingtimeFriday(): Observable<boolean[]> {
    return this.storeService.ringtimeList$.pipe(
      map((ringtimeList) => ringtimeList.map((ringtime) => ringtime.friday))
    );
  }

  getRingtimeSaturday(): Observable<boolean[]> {
    return this.storeService.ringtimeList$.pipe(
      map((ringtimeList) => ringtimeList.map((ringtime) => ringtime.saturday))
    );
  }

  getRingtimeSunday(): Observable<boolean[]> {
    return this.storeService.ringtimeList$.pipe(
      map((ringtimeList) => ringtimeList.map((ringtime) => ringtime.sunday))
    );
  }

  /*getRingtimeAddInfo(): Observable<string[]> {
    return this.storeService.ringtimeList$.pipe(
      map((ringtimeList) => ringtimeList.map((ringtime) => ringtime.addInfo))
    );
  }*/

  getWeekDaysAsString(): Observable<string[]> {
    return this.storeService.ringtimeList$.pipe(
      map((ringtimeList) => ringtimeList.map((ringtime) => {
        const weekDays = this.getWeekDaysFromOneRingtimeAsString(ringtime);
        return `${weekDays}`;
      }))
    );
  }

  getWeekDaysFromOneRingtimeAsString(ringtime: Ringtime) {
    let weekDays: string[] = []

    if (ringtime.monday) {
      weekDays.push("MO")
    }
    if (ringtime.tuesday) {
      weekDays.push("DI")
    }
    if (ringtime.wednesday) {
      weekDays.push("MI")
    }
    if (ringtime.thursday) {
      weekDays.push("DO")
    }
    if (ringtime.friday) {
      weekDays.push("FR")
    }
    if (ringtime.saturday) {
      weekDays.push("SA")
    }
    if (ringtime.sunday) {
      weekDays.push("SO")
    }
    return weekDays.join(", ")
  }


  /**
   * Method which is called when the edit button is clicked
   * @param index index of the ringTime
   */
  onEditRingtime(index: number) {
    this.storeService.ringtimeList$.pipe(
      take(1)).subscribe((ringtimeList) => {
      this.openDialogEditRingtime(ringtimeList[index], index);
    })
  }

  getRingtime(index: number) {
    return this.storeService.ringtimeList$.pipe(
      take(1)).subscribe((ringtimeList) => {
      return ringtimeList[index].id;
    })
  }

  // Response
  showResponse() {
    this.backendService
      .getRingtimeResponse()
      .pipe(
        tap((response) => {
          if (
            response.body &&
            response.body._embedded &&
            response.body._embedded.ringtimeDTOList

          ) {
            const ringtimeList = response.body._embedded.ringtimeDTOList;
            this.storeService.updateRingtimeList(ringtimeList);
          }
        })
      )
      .subscribe();
  }


  // transform shown number into real id of object
  getRealId(index: number) {
    this.storeService.ringtimeList$.pipe(
      take(1)).subscribe((ringtimeList) => {
      index = ringtimeList[index].id;
    })
    return index
  }

  /**
   * Opens a Modal-Dialog for add and updating a ringtime
   * @param ringtime updated ringtime object
   * @param edit add/edit mode
   */
  openDialogEditRingtime(ringtime: Ringtime, index: number) {
    let ringtimeDialog = this.createDialogResultFromRingtime(ringtime)
    const dialogRef = this.dialog.open(AddEditRingtimeComponent, {
      width: '500px',
      height: '950px',
      data: { isAddRingtone: false, ringtimeDialog: ringtimeDialog, index },
    });
    dialogRef.afterClosed().subscribe((result: RingtimeDialog) => {
      if (result) {
        console.log("AFTER CLOSED")
        console.log(result)
        this.convertDialogResultIntoRingtime(result, ringtime)

        ringtime.ringtoneDTO = this.getRingtoneDTOById(result.ringtoneId);

        this.backendService.updateRingtimeResource(ringtime).subscribe((response) => {
          const updatedRingtime = response.body;
          if (updatedRingtime) {
            this.storeService.ringtimeList$
              .pipe(take(1))
              .subscribe((currentRingtimeList) => {
                const updatedList = currentRingtimeList.map((ringtime) =>
                  ringtime.id === updatedRingtime.id ? updatedRingtime : ringtime
                );
                this.storeService.updateRingtimeList(updatedList);
              });
          }
        });

        this._snackBar.open(
          `Klingelzeit ${ringtime.name} wird aktualisieriert`,
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

  openDialogAddRingtime() {
    let ringtime: RingtimePayload;
    const dialogRef = this.dialog.open(AddEditRingtimeComponent, {
      width: '500px',
      height: '880px',
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        console.log("SAVE ADD")
        console.log(result)
        let ringtone = this.getRingtoneDTOById(result.ringtoneId);
        ringtime = this.createRingtimePayloadFromDialogResult(result, ringtone);
        console.log("RINGTIME")
        console.log(ringtime)
        this.backendService.postRingtimeRequest(ringtime).subscribe((response)=>{
          const newRingtone = response.body;
          if (newRingtone){
            this.storeService.ringtimeList$
              .pipe(take(1))
              .subscribe((currentRingtoneList) => {
                const updatedList = [...currentRingtoneList, newRingtone];
                this.storeService.updateRingtimeList(updatedList);
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

  onDeleteRingtime(index: any): void {
    index = this.getRealId(index);

    const dialogRef = this.dialog.open(DeleteDialogComponent, {
      width: '720px',
      height: '500px',
      data: { index: index },
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.backendService.deleteRingtimeResource(index).subscribe(() => {
          this.storeService.ringtimeList$
            .pipe(take(1))
            .subscribe((ringtimeList) => {
              const updatedRingtimeList = ringtimeList.filter(
                (ringtime) => ringtime.id !== index
              );
              this.storeService.updateRingtimeList(updatedRingtimeList);
            });
        });
      }
    });
  }

  convertDialogResultIntoRingtime(result: RingtimeDialog, ringtime: Ringtime) {
    ringtime.id = result.id;
    ringtime.name = result.name;
    ringtime.startDate = result.startDate;
    ringtime.endDate = result.endDate;
    ringtime.playTime = result.playTime;
    ringtime.monday = result.monday;
    ringtime.tuesday = result.tuesday;
    ringtime.wednesday = result.wednesday;
    ringtime.thursday = result.thursday;
    ringtime.friday = result.friday;
    ringtime.saturday = result.saturday;
    ringtime.sunday = result.sunday;
  }

  createDialogResultFromRingtime(ringtime: Ringtime) {
    return {
      id: ringtime.id,
      name: ringtime.name,
      ringtoneId: ringtime.ringtoneDTO.id,
      startDate: ringtime.startDate,
      endDate: ringtime.endDate,
      playTime: ringtime.playTime,
      monday: ringtime.monday,
      tuesday: ringtime.tuesday,
      wednesday: ringtime.wednesday,
      thursday: ringtime.thursday,
      friday: ringtime.friday,
      saturday: ringtime.saturday,
      sunday: ringtime.sunday
    }
  }

  createRingtimePayloadFromDialogResult(ringtimeDialog: RingtimeDialog, ringtone: Ringtone) {
    let ringtoneOnlyId = {
      id: ringtimeDialog.ringtoneId
    }
    return {
      name: ringtimeDialog.name,
      ringtoneDTO: ringtoneOnlyId,
      startDate: ringtimeDialog.startDate,
      endDate: ringtimeDialog.endDate,
      playTime: ringtimeDialog.playTime,
      monday: ringtimeDialog.monday ? true : false,
      tuesday: ringtimeDialog.tuesday ? true : false,
      wednesday: ringtimeDialog.wednesday ? true : false,
      thursday: ringtimeDialog.thursday ? true : false,
      friday: ringtimeDialog.friday ? true : false,
      saturday: ringtimeDialog.saturday ? true : false,
      sunday: ringtimeDialog.sunday ? true : false
    }
  }

  getRingtoneDTOById(ringtoneId: number) {
    let ringtone!: Ringtone;
    this.storeService.ringtoneList$.pipe(
      take(1)).subscribe((ringtoneList) => {
      for (let i = 0; i < ringtoneList.length; i++) {
        if (ringtoneList[i].id === ringtoneId) {
          ringtone =  ringtoneList[i];
        }
      }
    });
    return ringtone;
  }
}
