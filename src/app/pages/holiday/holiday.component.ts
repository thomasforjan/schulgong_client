import {Component, OnInit} from '@angular/core';
import {HeroImages, StoreService} from "../../services/store.service";
import {map} from "rxjs/operators";
import {BackendService} from "../../services/backend.service";
import {MatDialog} from "@angular/material/dialog";
import {Holiday} from "../../models/Holiday";

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
  holidayName$ = this.storeService.holidayList$.pipe(map((holidayList) => holidayList.map((holiday) => holiday.name)));

  /**
   * Get the start and end date in one string from the holiday list
   */
  holidayDate$ = this.storeService.holidayList$.pipe(map((holidayList) => holidayList.map((holiday) => {
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

  constructor(public storeService: StoreService, private backendService: BackendService, private dialog: MatDialog) {}

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
}
