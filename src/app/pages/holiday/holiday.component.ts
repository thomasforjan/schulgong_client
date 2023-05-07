import {Component, OnInit} from '@angular/core';
import {HeroImages, StoreService} from "../../services/store.service";
import {map, take} from "rxjs/operators";
import {BackendService} from "../../services/backend.service";
import {MatDialog} from "@angular/material/dialog";
import {Holiday} from "../../models/Holiday";
import {DeleteDialogComponent} from "../../components/delete-dialog/delete-dialog.component";
import {MatSnackBar} from "@angular/material/snack-bar";
import {AddEditHolidaysComponent} from "./add-edit-holidays/add-edit-holidays.component";

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


  constructor(
    public storeService: StoreService,
    private backendService: BackendService,
    private dialog: MatDialog,
    private _snackBar: MatSnackBar
  ) {
  }

  /**
   * Get the start and end date in one string from the holiday list
   */
  holidayDate$ = this.storeService.holidayList$.pipe(
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

  ngOnInit(): void {
    this.getHolidays();
  }

  /**
   * Get the holidays from the backend
   */
  getHolidays() {
    this.backendService
      .getHolidayResponse()
      .subscribe((holidayList: Holiday[] | null) => {
        if (holidayList && holidayList.length > 0) {
          this.storeService.updateHolidayList(holidayList);
        }
      });
  }

  /**
   * Method which is called when the add button is clicked
   */
  holidayAddDialog() {
    const dialogRef = this.dialog.open(AddEditHolidaysComponent, {
      width: '720px',
      height: '650px',
      data: { isAddHoliday: true },
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.backendService.postHolidayRequest(result).subscribe((response) => {
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
        });
      }
    });
  }

  /**
   * Method which is called when the delete button is clicked
   * @param index index of the holiday entry
   */
  onDeleteHoliday(index: any): void {
    index = this.getRealId(index);

    const dialogRef = this.dialog.open(DeleteDialogComponent, {
      width: '720px',
      height: '500px',
      data: {index: index},
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.backendService.deleteHolidayResource(index).subscribe(
          () => {
            this.storeService.holidayList$
              .pipe(take(1))
              .subscribe((holidayList) => {
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
   * Transform shown number into real id of object
   * @param index of object
   * @returns real id of object
   */
  getRealId(index: number) {
    this.storeService.holidayList$.pipe(take(1)).subscribe((holidayList) => {
      index = holidayList[index].id;
    });
    return index;
  }
}
