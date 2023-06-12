import {Component, OnInit} from '@angular/core';
import {HeroImages, StoreService} from "../../services/store.service";
import {map, take} from "rxjs/operators";
import {MatDialog} from "@angular/material/dialog";
import {Holiday} from "../../models/Holiday";
import {DeleteDialogComponent} from "../../components/delete-dialog/delete-dialog.component";
import {MatSnackBar} from "@angular/material/snack-bar";
import {AddEditHolidaysComponent} from "./add-edit-holidays/add-edit-holidays.component";
import {HolidayBackendService} from "../../services/holiday.backend.service";
import {UtilsService} from "../../services/utils.service";

@Component({
  selector: 'app-holiday', templateUrl: './holiday.component.html', styleUrls: ['./holiday.component.scss']
})
export class HolidayComponent implements OnInit {

  /**
   * Holiday Hero Image from enum in store service
   */
  holidayHeroImage: string = HeroImages.HolidayHeroImage;

  /**
   * Get the length of the holiday list
   */
  cardLength$ = this.storeService.holidayList$.pipe(map((list) => list.length));

  /**
   * Get the holiday name from the holiday list
   */
  holidayName$ = this.storeService.holidayList$.pipe(
    map((holidayList) => holidayList.map((holiday) => holiday.name)));
  /**
   * Get the start and end date in one string from the holiday list
   */
  holidayPeriod$ = this.storeService.holidayList$.pipe(
    map((holidayList) =>
      holidayList.map((holiday) => {
        const startDate = new Date(holiday.startDate);
        const endDate = new Date(holiday.endDate);
        const formattedStartDate = startDate.toLocaleDateString('de-DE', {
          day: '2-digit', month: '2-digit', year: 'numeric'
        });
        const formattedEndDate = endDate.toLocaleDateString('de-DE', {
          day: '2-digit', month: '2-digit', year: 'numeric'
        });
        return `${formattedStartDate} - ${formattedEndDate}`;
      })));

  /**
   * Boolean for delete-all-button
   */
  disableDeleteAllBtn!: boolean

  constructor(
    public storeService: StoreService,
    private _holidayBackendService: HolidayBackendService,
    private _dialog: MatDialog,
    private _snackBar: MatSnackBar,
    private _utilsService: UtilsService,
  ) {
  }

  ngOnInit(): void {
    this.getHolidays();
    this.setDisableDeleteAllBtn();
  }

  /**
   * Get the holidays from the backend
   */
  getHolidays() {
    this._holidayBackendService
      .getHolidayResponse()
      .subscribe((holidayList: Holiday[] | null) => {
        if (holidayList && holidayList.length > 0) {
          this.storeService.updateHolidayList(holidayList);
        }
      });
  }

  /**
   * Method which is called when the edit button is clicked
   * @param index index of the holiday entry
   */
  onEditHoliday(index: number) {
    const realId = this._utilsService.getRealObjectId(index, this.storeService.holidayList$);
    if (realId !== undefined) {
      this.storeService.holidayList$.pipe(take(1)).subscribe((holidayList) => {
        const holidayToEdit = holidayList.find(
          (holiday) => holiday.id === realId
        );
        if (holidayToEdit) {
          this.holidayEditDialog(holidayToEdit, index + 1);
        }
      });
    }
  }

  /**
   * Method which is called when the add button is clicked
   */
  holidayAddDialog() {
    const dialogRef = this._dialog.open(AddEditHolidaysComponent, {
      width: '720px',
      height: '650px',
      data: {isAddHoliday: true},
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this._holidayBackendService.postHolidayRequest(result).subscribe((response) => {
          const newHoliday = response.body;
          if (newHoliday) {
            this.storeService.holidayList$
              .pipe(take(1))
              .subscribe((currentHolidayList) => {
                const updatedList = [...currentHolidayList, newHoliday];
                this.storeService.updateHolidayList(updatedList);
              });

            this._snackBar.open('Schulfrei wird hinzugefügt', 'Ok', {
              horizontalPosition: 'end',
              verticalPosition: 'bottom',
              duration: 2000,
            });
          }
          this.setDisableDeleteAllBtn();
        });
      }
    });
  }

  /**
   * Method which is called when the edit button is clicked
   * @param holiday holiday entry to edit
   * @param index index of holiday object
   */
  holidayEditDialog(holiday: Holiday, index: number) {
    const dialogRef = this._dialog.open(AddEditHolidaysComponent, {
      width: '720px',
      height: '650px',
      data: {isAddHoliday: false, holiday, index},
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        const updateRequest = this._holidayBackendService.updateHolidayResource(
          result,
          holiday.id
        );

        updateRequest.subscribe((response) => {
          const updatedHoliday = response.body;
          if (updatedHoliday) {
            this.storeService.holidayList$.pipe(take(1)).subscribe((result) => {
              const updatedList = result.map((holiday) =>
                holiday.id === updatedHoliday.id ? updatedHoliday : holiday
              );
              this.storeService.updateHolidayList(updatedList);
            });

            this._snackBar.open('Schulfrei wurde aktualisiert', 'Ok', {
              horizontalPosition: 'end',
              verticalPosition: 'bottom',
              duration: 2000,
            });
          }
        });
      }
    });
  }

  /**
   * Method which is called when the delete button is clicked
   * @param index index of the holiday entry
   */
  onDeleteHoliday(index: any): void {
    index = this._utilsService.getRealObjectId(index, this.storeService.holidayList$);

    const dialogRef = this._dialog.open(DeleteDialogComponent, {
      width: '720px',
      height: '500px',
      data: {index: index},
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this._holidayBackendService.deleteHolidayResource(index).subscribe(
          () => {
            this.storeService.holidayList$
              .pipe(take(1))
              .subscribe((holidayList) => {
                this.disableDeleteAllBtn = holidayList.length - 1 == 0;
                const updateHolidayList = holidayList.filter(
                  (holiday) => holiday.id !== index
                );
                this.storeService.updateHolidayList(updateHolidayList);
              });
            this._snackBar.open('Schulfrei erfolgreich gelöscht!', 'Ok', {
              horizontalPosition: 'end',
              verticalPosition: 'bottom',
              duration: 2000,
            });
          },
        );
      }
    });
  }

  /**
   * Method to delete all holidays
   */
  holidayDeleteAllDialog() {
    const dialogRef = this._dialog.open(DeleteDialogComponent, {
      width: '720px',
      height: '500px',
      data: {titleText: "Möchten Sie alle Einträge"},
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this._holidayBackendService.deleteAllHolidayResource().subscribe(
          () => {
            this.storeService.updateHolidayList([]);
            this._snackBar.open('Alle Schulfrei-Einträge erfolgreich gelöscht!', 'Ok', {
              horizontalPosition: 'end',
              verticalPosition: 'bottom',
              duration: 2000,
            });
          },
        );
        this.disableDeleteAllBtn = true;
      }
    });
  }

  /**
   * Method to disable the all-delete button
   */
  setDisableDeleteAllBtn() {
    this.storeService.holidayList$.pipe(take(1)).subscribe((list) => {
      this.disableDeleteAllBtn = list.length == 0;
    });
  }
}
