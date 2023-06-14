import {Component, OnInit} from '@angular/core';
import {StoreService} from 'src/app/services/store.service';
import {HolidayBackendService} from "../../services/holiday.backend.service";
import {RingtimeBackendService} from "../../services/ringtime.backend.service";
import {Ringtime} from "../../models/Ringtime";
import {
  catchError,
  combineLatest,
  distinctUntilChanged,
  Observable,
  of,
  shareReplay,
  startWith,
  switchMap,
  timer
} from "rxjs";
import {Holiday} from "../../models/Holiday";
import {map} from "rxjs/operators";
import {DateUtilsService} from "../../services/date-utils.service";
import {Time} from "@angular/common";

/**
 * @author: Thomas Forjan, Philipp Wildzeiss, Martin Kral
 * @version: 0.0.2
 * @since: April 2023
 * @description: Info-bar component
 */
@Component({
  selector: 'app-info-bar',
  templateUrl: './info-bar.component.html',
  styleUrls: ['./info-bar.component.scss'],
})
export class InfoBarComponent implements OnInit {
  /**
   * @description Observable for the next gong
   */
  nextGong$!: Observable<string | null>;

  /**
   * @description Observable for no upcoming gongs
   */
  noUpcomingGongs$!: Observable<boolean>;

  /**
   * @description Observable for holidays
   */
  holiday$!: Observable<Holiday | null>;
  /**
   *  @description An Observable that calculates the time offset between the client's current time and the server time
   *  @returns time offset in milliseconds
   */
  serverTimeOffset$: Observable<number> = this._ringtimeBackendService
    .getServerTime()
    .pipe(
      map(
        (serverTimeObj) => new Date(serverTimeObj.time).getTime() - Date.now()
      ),
      // The shareReplay(1) operator is used to share the emitted value with all subscribers, replaying the most recent value to any new subscribers.
      shareReplay(1)
    );
  /**
   *  @description An Observable that emits the server time every second, considering the time offset between the client and the server
   *  @note This does not cause unnecessary network traffic, as the server time is fetched only once and the updates are based on the client's clock.
   */
  serverTime$: Observable<Date> = combineLatest([
    this.serverTimeOffset$,
    timer(0, 1000),
  ]).pipe(map(([offset]) => new Date(Date.now() + offset)));
  /**
   *  @description An observable that emits the formatted server date as a string, updating with the server time
   */
  currentDate$: Observable<string> = this.serverTime$.pipe(
    map((serverTime) => this.getDateString(serverTime))
  );
  /**
   * @description An observable for the current time as a localized string
   */
  currentTime$: Observable<string> = this.serverTime$.pipe(
    map((serverTime) => new Date(serverTime).toLocaleTimeString())
  );

  /**
   * @description Constructor
   * @param _storeService Injected StoreService
   * @param _holidayBackendService Injected Holiday-BackendService
   * @param _ringtimeBackendService Injected Ringtime-BackendService
   * @param _dateUtilsService Injected DateService
   */
  constructor(
    private _storeService: StoreService,
    private _holidayBackendService: HolidayBackendService,
    private _ringtimeBackendService: RingtimeBackendService,
    private _dateUtilsService: DateUtilsService
  ) {
  }

  /**
   * @description Lifecycle Hook - ngOnInit
   */
  ngOnInit() {
    /**
     * @description Load Ringtimes
     */
    this.loadRingtimes();

    /**
     * @description Load Holidays
     */
    this.fetchHolidays();

    /**
     * @description Set up the holiday observable
     */
    this.setupHolidayObservable();
  }

  /**
   * @description Set up the holiday observable by combining holiday ID with holiday list
   */
  setupHolidayObservable() {
    const holidayId$ = this.getHolidayIdObservable();
    this.holiday$ = this.combineHolidayIdWithHolidayList(holidayId$);
  }

  /**
   * @description Create an observable for the holiday ID
   * @returns An observable that emits the holiday ID or null if no holiday is found
   */
  getHolidayIdObservable(): Observable<number | null> {
    return this._storeService.holidayList$.pipe(
      switchMap(() =>
        this._holidayBackendService.getHolidayToday().pipe(
          map((holidayId: number) => holidayId),
          catchError(() => of(null))
        )
      ),
      shareReplay(1)
    );
  }

  /**
   * @description Combine the holiday ID observable with the holiday list to create an observable for the current holiday
   * @param holidayId$ The holiday ID observable
   * @returns An observable that emits the holiday object or null if no holiday is found
   */
  combineHolidayIdWithHolidayList(
    holidayId$: Observable<number | null>
  ): Observable<Holiday | null> {
    return combineLatest([holidayId$, this._storeService.holidayList$]).pipe(
      map(([holidayId, holidayList]) => {
        const holiday = holidayList.find((h) => h.id === holidayId);
        return holiday || null;
      }),
      shareReplay(1)
    );
  }

  /**
   * @description Loads ringtimes, sets up the next gong observable, and sets up the no upcoming gongs observable.
   */
  loadRingtimes() {
    this.fetchRingtimes();
    this.setupNextGongObservable();
    this.setupNoUpcomingGongsObservable();
  }

  /**
   * @description Fetches ringtimes from the backend and subscribes to the response.
   */
  fetchRingtimes() {
    this._ringtimeBackendService.getRingtimeResponse().subscribe();
  }

  /**
   * @description Fetches holidays from the backend and subscribes to the response.
   */
  fetchHolidays() {
    this._holidayBackendService
      .getHolidayResponse().subscribe();
  }

  /**
   * @description Sets up the next gong observable, which calculates the next gong based on the current server time.
   */
  setupNextGongObservable() {
    this.nextGong$ = this.serverTime$.pipe(
      switchMap((currentTime) => this.calculateNextGong$(currentTime)),
      shareReplay(1)
    );
  }

  /**
   * @description Sets up the no upcoming gongs observable, which determines if there are no upcoming gongs.
   */
  setupNoUpcomingGongsObservable() {
    this.noUpcomingGongs$ = this.nextGong$.pipe(
      map((nextGong) => !nextGong),
      startWith(false)
    );
  }

  /**
   * @description Calculates the next gong based on the current time and the list of ringtimes from the store.
   * @param currentTime The current time
   * @returns An Observable emitting the display time of the next gong, or null if there are no upcoming gongs.
   */
  calculateNextGong$(currentTime: Date): Observable<string | null> {
    return combineLatest([
      this._storeService.ringtimeList$,
      of(currentTime),
    ]).pipe(
      map(([ringtimes, currentTime]) => {

        /**
         * Creation of a new Date object that points to exactly one minute (60,000 milliseconds) after the current time. It is used to ensure that
         * the next gong is at least one minute in the future.
         * The reason for this is that the InfoBarComponent displays all information about the next ringtime that is at least one minute in the future,
         * to avoid displaying a ringtime that has already passed, or to avoid displaying a ringtime that will sound in less than one minute, possibly not in time.
         */
        const currentTimePlusOneMinute = new Date(
          currentTime.getTime() + 60000
        );

        // Find the next upcoming gong at least one minute in the future
        const nextGong = this.getNextGong(ringtimes, currentTimePlusOneMinute);
        // Return an object with the display time of the next gong and the next gong itself
        return {
          displayTime: nextGong.displayItem,
          nextGong: nextGong.ringtime,
        };
      }),
      // Update the next gong in the store
      switchMap(({displayTime, nextGong}) =>
        this.updateNextGong(displayTime, nextGong)
      ),
      // Only emit values when the next gong changes
      distinctUntilChanged()
    );
  }

 /* /!**
   * @description Get the display time of the next gong
   * @param nextGong Next Gong
   * @returns display time of the next gong
   *!/
  getDisplayTime(nextGong: Ringtime | null): string | null {
    // If nextGong exists, format its playTime as a localized time string, otherwise return null
    return nextGong
      ? this.timeToDate(nextGong.playTime).toLocaleTimeString('de-DE', {
        hour: '2-digit',
        minute: '2-digit',
      })
      : null;
  }*/

  /**
   * @description Update the display time of the next gong and trigger a new update when the next gong is played
   * @param displayTime The current display time of the next gong
   * @param nextGong The next gong ringtime
   * @returns An Observable that emits the display time of the next gong, or null if there are no upcoming gongs
   */
  updateNextGong(
    displayTime: string | null,
    nextGong: Ringtime | null
  ): Observable<string | null> {
    console.log(displayTime);
    console.log(nextGong);
    if (nextGong) {
      // If there is a next gong, proceed with the update logic
      return this.serverTime$.pipe(
        switchMap((currentTime) => {
          // Calculate the time remaining until the next gong
          const timeToNextGong =
            this.timeToDate(nextGong.playTime).getTime() -
            currentTime.getTime();
          // If the time remaining is less than or equal to 0, the next gong has already played
/*          if (timeToNextGong <= 0) {
            // Calculate the next gong since the current one has already played
            return this.calculateNextGong$(currentTime);
          }
          // If the next gong hasn't played yet, return the current display time*/
          return of(displayTime);
        })
      );
    } else {
      // If there are no upcoming gongs, return null
      return of(null);
    }
  }

  /**
   * @description Converts a Date object to a formatted string in German locale, including day, month and year.
   * @param serverTime The Date object to be formatted.
   * @returns The formatted string.
   */
  getDateString(serverTime: Date): string {
    return this._dateUtilsService.convertDateTimeToString(serverTime, 'de-DE');
  }

  /**
   * @description Converts a `Time` object to a `Date` object with the same hours and minutes.
   * @param time The `Time` object to convert.
   * @returns A `Date` object with the same hours and minutes as the input `Time`.
   */
  private timeToDate(time: Time): Date {
    const date = new Date();
    const [hours, minutes] = time.toString().split(':');
    date.setHours(+hours);
    date.setMinutes(+minutes);
    return date;
  }

  getRightRingtimes(ringtimes: Ringtime[], currentTime: Date): any[] {
    let infoItems: any[] = [];

    ringtimes.forEach((ringtime) => {
      const exists = infoItems.some(rt => rt.id === ringtime.id)
      let checkDays = this.checkDays(ringtime, currentTime);
      if (!exists && checkDays[0]) {

        let today = new Date().getDay()
        console.log(today);
        console.log(checkDays[1].getDay());

        if (checkDays[1].getDay() == today) {
          infoItems.push([ringtime, checkDays[1], ringtime.playTime]);
        } else {
          infoItems.push([ringtime, checkDays[1], checkDays[1].toLocaleDateString("de-De") + ", " + ringtime.playTime])
        }


      }
    })

    infoItems.sort((a, b) => {
      const compareDay = a[1].valueOf() - b[1].valueOf();

      if (compareDay === 0) {
        return a[0].playTime - b[0].playTime;
      }
      return compareDay;
    });

    let displayArray: any[] = [];

    infoItems.forEach(infoItem => {
      displayArray.push({
        ringtime: infoItem[0],
        displayItem: infoItem[2]
      });

    })

    return displayArray;
  }

  checkDays(item: Ringtime, currentTime: Date): [boolean, Date] {
    let today: Date = new Date();
    this.currentDate$.subscribe(date => {
        today = new Date(date);
      }
    )
    let checkDays: boolean = false;
    let checkPeriod: boolean = false;

    for (let i = 0; i < 4; i++) {
      switch (today.getDay()) {
        case 0:
          checkDays = item.sunday;
          break;
        case 1:
          checkDays = item.monday;
          break;
        case 2:
          checkDays = item.tuesday;
          break;
        case 3:
          checkDays = item.wednesday;
          break;
        case 4:
          checkDays = item.thursday;
          break;
        case 5:
          checkDays = item.friday;
          break;
        case 6:
          checkDays = item.saturday;
          break;
        default:
          break;
      }

      if (checkDays && this.checkPeriod(item, today)) {
        if (today.getDate() !== new Date().getDate() || this.timeToDate(item.playTime) >= currentTime){
          checkPeriod = true;
          continue;
        }
      }
      today.setDate(today.getDate() + 1);
    }

    return [checkPeriod, today];
  }

  checkPeriod(item: Ringtime, today: Date): boolean {
    const startDate = new Date(item.startDate);
    const endDate = new Date(item.endDate);
    startDate.setHours(0, 0, 0);
    endDate.setHours(0, 0, 0);
    endDate.setDate(endDate.getDate() + 1);

    return today.valueOf() >= startDate.valueOf() && today.valueOf() <= endDate.valueOf();
  }

  /**
   * @description Gets the next gong from a list of ringtimes based on the current time
   * @param ringtimes The list of ringtimes to check
   * @param currentTime The current time
   * @returns The next gong ringtime, or null if there are no upcoming gongs
   */
  private getNextGong(ringtimes: Ringtime[], currentTime: Date) {

    // Filter the list of ringtimes to only include upcoming ringtimes for the current or the next three days
    const upcomingRingtimes = this.getRightRingtimes(ringtimes, currentTime);

    // Return the first upcoming ringtime if any exist, otherwise return null
    return upcomingRingtimes.length > 0 ? upcomingRingtimes[0] : "";
  }


}
