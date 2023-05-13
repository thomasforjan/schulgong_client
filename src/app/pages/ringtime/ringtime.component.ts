import {Component, OnInit} from '@angular/core';
import {map, take} from 'rxjs';
import {HeroImages, StoreService,} from 'src/app/services/store.service';
import {Ringtime, RingtimeDialog, RingtimePayload,} from '../../models/Ringtime';
import {AddEditRingtimeComponent} from './add-edit-ringtime/add-edit-ringtime.component';
import {MatDialog} from '@angular/material/dialog';
import {MatSnackBar} from '@angular/material/snack-bar';
import {Ringtone} from '../../models/Ringtone';
import {DeleteDialogComponent} from '../../components/delete-dialog/delete-dialog.component';
import {DateUtilsService} from 'src/app/services/date-utils.service';
import {UtilsService} from "../../services/utils.service";
import {RingtimeBackendService} from "../../services/ringtime.backend.service";
import {RingtoneBackendService} from "../../services/ringtone.backend.service";

/**
 * @author: Thomas Forjan, Philipp Wildzeiss, Martin Kral
 * @version: 0.0.2
 * @since: April 2023
 * @description: Ringtime component
 */
@Component({
  selector: 'app-ringtime',
  templateUrl: './ringtime.component.html',
  styleUrls: ['./ringtime.component.scss'],
})
export class RingtimeComponent implements OnInit{
  /**
   * Ringtime Hero Image from enum in store service
   */
  ringtimeHeroImage: string = HeroImages.RingtimeHeroImage;

  /**
   * Get the length of the ringtime list
   */
  cardLength$ = this.storeService.ringtimeList$.pipe(
    map((list) => list.length)
  );
  /**
   * Get the ringtime name from the ringtime list
   */
  ringtimeName$ = this.storeService.ringtimeList$.pipe(
    map((ringtimeList) => ringtimeList.map((ringtime) => ringtime.name))
  );
  /**
   * Get the start and end date in one string from the ringtime list
   */
  ringtimePeriod$ = this.storeService.ringtimeList$.pipe(
    map((ringtimeList) => ringtimeList.map((ringtime) => {
      return this._dateUtilsService.createDatesToStringPeriod(ringtime.startDate, ringtime.endDate, 'De-de');
    })));
  /**
   * Get the ringtone name from the ringtime list
   */
  ringtoneName$ = this.storeService.ringtimeList$.pipe(
    map((ringtimeList) =>
      ringtimeList.map((ringtime) => ringtime.ringtoneDTO.name)
    )
  );
  /**
   * Get the playtime with unit in one string from the ringtime list
   */
  ringingPlaytime$ = this.storeService.ringtimeList$.pipe(
    map((ringtimeList) =>
      ringtimeList.map((ringtime) => {
        return `${ringtime.playTime} Uhr`;
      })
    )
  );
  /**
   * Get the weekdays in one string from the ringtime list
   */
  weekDaysAsString$ = this.storeService.ringtimeList$.pipe(
    map((ringtimeList) =>
      ringtimeList.map((ringtime) => {
        const weekDays = this.getWeekDaysFromOneRingtimeAsString(ringtime);
        return `${weekDays}`;
      })
    )
  );

  constructor(
    public storeService: StoreService,
    private _ringtimeBackendService: RingtimeBackendService,
    private _ringtoneBackendService: RingtoneBackendService,
    private _dateUtilsService: DateUtilsService,
    private _dialog: MatDialog,
    private _utilsService: UtilsService,
    private _snackBar: MatSnackBar
  ) {
  }

  ngOnInit(): void {
    /**
     * Load ringtimes from backend service
     */
    this._ringtimeBackendService.getRingtimeResponse().subscribe();

    /**
     * Load ringtones from backend service
     */
    this._ringtoneBackendService.getRingtoneResponse().subscribe();
  }

  /**
   * Transform separate days from a ringtime into one string
   */
  getWeekDaysFromOneRingtimeAsString(ringtime: Ringtime) {
    let weekDays: string[] = [];

    if (ringtime.monday) {
      weekDays.push('MO');
    }
    if (ringtime.tuesday) {
      weekDays.push('DI');
    }
    if (ringtime.wednesday) {
      weekDays.push('MI');
    }
    if (ringtime.thursday) {
      weekDays.push('DO');
    }
    if (ringtime.friday) {
      weekDays.push('FR');
    }
    if (ringtime.saturday) {
      weekDays.push('SA');
    }
    if (ringtime.sunday) {
      weekDays.push('SO');
    }
    return weekDays.join(', ');
  }

  /**
   * Method which is called when the edit button is clicked
   * @param index index of the ringtime
   */
  onEditRingtime(index: number) {
    this.storeService.ringtimeList$.pipe(take(1)).subscribe((ringtimeList) => {
      this.openDialogEditRingtime(ringtimeList[index], index);
    });
  }

  /**
   * Opens a Modal-Dialog for updating a ringtime
   * @param ringtime updated ringtime object
   * @param index shown index
   */
  openDialogEditRingtime(ringtime: Ringtime, index: number) {
    let ringtimeDialog = this.createDialogResultFromRingtime(ringtime);
    const dialogRef = this._dialog.open(AddEditRingtimeComponent, {
      width: '720px',
      height: '',
      data: {isAddRingtone: false, ringtimeDialog: ringtimeDialog, index},
    });
    dialogRef.afterClosed().subscribe((result: RingtimeDialog) => {
      if (result) {
        this.convertDialogResultIntoRingtime(result, ringtime);

        ringtime.ringtoneDTO = this.getRingtoneDTOById(result.ringtoneId);

        this._ringtimeBackendService
          .updateRingtimeResource(ringtime)
          .subscribe((response) => {
            const updatedRingtime = response.body;
            if (updatedRingtime) {
              this.storeService.ringtimeList$
                .pipe(take(1))
                .subscribe((currentRingtimeList) => {
                  const updatedList = currentRingtimeList.map((ringtime) =>
                    ringtime.id === updatedRingtime.id
                      ? updatedRingtime
                      : ringtime
                  );
                  this.storeService.updateRingtimeList(updatedList);
                });
            }
          });

        this._snackBar.open(
          `Klingelzeit ${ringtime.name} wird aktualisiert`,
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

  /**
   * Opens a Modal-Dialog for adding a ringtime
   */
  openDialogAddRingtime() {
    let ringtime: RingtimePayload;
    const dialogRef = this._dialog.open(AddEditRingtimeComponent, {
      width: '720px',
      height: '',
      data: {isAddRingtime: true},
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        ringtime = this.createRingtimePayloadFromDialogResult(result);
        this._ringtimeBackendService
          .postRingtimeRequest(ringtime)
          .subscribe((response) => {
            const newRingtone = response.body;
            if (newRingtone) {
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

  /**
   * Opens a Modal-Dialog for deleting a ringtime
   * @param index shown index
   */
  onDeleteRingtime(index: any): void {
    index = this._utilsService.getRealObjectId(index, this.storeService.ringtimeList$);

    const dialogRef = this._dialog.open(DeleteDialogComponent, {
      width: '720px',
      height: '500px',
      data: {index: index},
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this._ringtimeBackendService.deleteRingtimeResource(index).subscribe(() => {
          this.storeService.ringtimeList$
            .pipe(take(1))
            .subscribe((ringtimeList) => {
              const updatedRingtimeList = ringtimeList.filter(
                (ringtime) => ringtime.id !== index
              );
              this.storeService.updateRingtimeList(updatedRingtimeList);
            });
          this._snackBar.open('Klingelzeit erfolgreich gelöscht!', 'Ok', {
            horizontalPosition: 'end',
            verticalPosition: 'bottom',
            duration: 2000,
          });
        });
      }
    });
  }

  /**
   * Converts ringtimeDialog into ringtime
   */
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

  /**
   * Create a ringtimeDialog from ringtime
   */
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
      sunday: ringtime.sunday,
    };
  }

  /**
   * Create ringtimePayload from ringtimeDialog
   */
  createRingtimePayloadFromDialogResult(ringtimeDialog: RingtimeDialog) {
    return {
      name: ringtimeDialog.name,
      ringtoneDTO: {id: ringtimeDialog.ringtoneId},
      startDate: ringtimeDialog.startDate,
      endDate: ringtimeDialog.endDate,
      playTime: ringtimeDialog.playTime,
      monday: ringtimeDialog.monday,
      tuesday: ringtimeDialog.tuesday,
      wednesday: ringtimeDialog.wednesday,
      thursday: ringtimeDialog.thursday,
      friday: ringtimeDialog.friday,
      saturday: ringtimeDialog.saturday,
      sunday: ringtimeDialog.sunday,
    };
  }

  /**
   * Get ringtoneDTO by id
   */
  getRingtoneDTOById(ringtoneId: number) {
    let ringtone!: Ringtone;
    this.storeService.ringtoneList$.pipe(take(1)).subscribe((ringtoneList) => {
      for (const element of ringtoneList) {
        if (element.id === ringtoneId) {
          ringtone = element;
        }
      }
    });
    return ringtone;
  }
}
