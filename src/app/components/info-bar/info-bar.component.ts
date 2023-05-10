/**
 * author: Thomas Forjan, Philipp Wildzeiss, Martin Kral
 * version: 0.0.2
 * date: 03/05/2023
 * description: info bar component
 */

import { Time } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import {
  Observable,
  catchError,
  combineLatest,
  distinctUntilChanged,
  map,
  of,
  shareReplay,
  startWith,
  switchMap,
  tap,
  timer,
} from 'rxjs';
import { Ringtime } from 'src/app/models/Ringtime';
import { StoreService } from 'src/app/services/store.service';
import { BackendService } from '../../services/backend.service';
import { DateUtilsService } from 'src/app/services/date-utils.service';
import { Holiday } from 'src/app/models/Holiday';

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
   * @description Constructor
   * @param storeService Injected StoreService
   * @param backendService Injected BackendService
   */
  constructor(
    private storeService: StoreService,
    private backendService: BackendService,
    private dateUtilsService: DateUtilsService
  ) {}

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
    return this.storeService.holidayList$.pipe(
      switchMap(() =>
        this.backendService.getHolidayToday().pipe(
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
    return combineLatest([holidayId$, this.storeService.holidayList$]).pipe(
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

    // TODO: Use this line after backend.service.ts refactoring is done!
    //this.backendService.getRingtimeResponse().subscribe();
  }

  /**
   * @description Fetches holidays from the backend and subscribes to the response.
   */
  fetchHolidays() {
    this.backendService
      .getHolidayResponse()
      .subscribe((holidayList: Holiday[] | null) => {
        if (holidayList && holidayList.length > 0) {
          this.storeService.updateHolidayList(holidayList);
        }
      });

    // TODO: Use this line after backend.service.ts refactoring is done!
    //this.backendService.getHolidayResponse().subscribe();
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
      this.storeService.ringtimeList$,
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
          displayTime: this.getDisplayTime(nextGong),
          nextGong: nextGong,
        };
      }),
      // Update the next gong in the store
      switchMap(({ displayTime, nextGong }) =>
        this.updateNextGong(displayTime, nextGong)
      ),
      // Only emit values when the next gong changes
      distinctUntilChanged()
    );
  }

  /**
   * @description Get the display time of the next gong
   * @param nextGong Next Gong
   * @returns display time of the next gong
   */
  getDisplayTime(nextGong: Ringtime | null): string | null {
    // If nextGong exists, format its playTime as a localized time string, otherwise return null
    return nextGong
      ? this.timeToDate(nextGong.playTime).toLocaleTimeString('de-DE', {
          hour: '2-digit',
          minute: '2-digit',
        })
      : null;
  }

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
    if (nextGong) {
      // If there is a next gong, proceed with the update logic
      return this.serverTime$.pipe(
        switchMap((currentTime) => {
          // Calculate the time remaining until the next gong
          const timeToNextGong =
            this.timeToDate(nextGong.playTime).getTime() -
            currentTime.getTime();
          // If the time remaining is less than or equal to 0, the next gong has already played
          if (timeToNextGong <= 0) {
            // Calculate the next gong since the current one has already played
            return this.calculateNextGong$(currentTime);
          }
          // If the next gong hasn't played yet, return the current display time
          return of(displayTime);
        })
      );
    } else {
      // If there are no upcoming gongs, return null
      return of(null);
    }
  }

  /**
   *  @description An Observable that calculates the time offset between the client's current time and the server time
   *  @returns time offset in milliseconds
   */
  serverTimeOffset$: Observable<number> = this.backendService
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
   * @description Converts a Date object to a formatted string in German locale, including day, month and year.
   * @param serverTime The Date object to be formatted.
   * @returns The formatted string.
   */
  getDateString(serverTime: Date): string {
    return this.dateUtilsService.convertDateTimeToString(serverTime, 'de-DE');
  }

  /**
   * @description Gets the next gong from a list of ringtimes based on the current time
   * @param ringtimes The list of ringtimes to check
   * @param currentTime The current time
   * @returns The next gong ringtime, or null if there are no upcoming gongs
   */
  private getNextGong(
    ringtimes: Ringtime[],
    currentTime: Date
  ): Ringtime | null {
    // Get the current day of the week as an integer (0 for Sunday, 1 for Monday, etc.)
    const currentWeekDay = currentTime.getDay();

    // Map the integer to the corresponding day of the week string
    const currentDayOfWeek = [
      'sunday',
      'monday',
      'tuesday',
      'wednesday',
      'thursday',
      'friday',
      'saturday',
    ][currentWeekDay];

    // Filter the list of ringtimes to only include upcoming ringtimes for the current day
    const upcomingRingtimes = this.getUpcomingRingtimes(
      ringtimes,
      currentTime,
      currentDayOfWeek
    );

    // Return the first upcoming ringtime if any exist, otherwise return null
    return upcomingRingtimes.length > 0 ? upcomingRingtimes[0] : null;
  }

  /**
   * @description Filter the upcoming ringtimes based on the current day and time
   * @param ringtimes List of all ringtimes
   * @param currentTime Current time
   * @param currentDayOfWeek Current day of the week
   * @returns Filtered list of upcoming ringtimes
   */
  private getUpcomingRingtimes(
    ringtimes: Ringtime[],
    currentTime: Date,
    currentDayOfWeek: string
  ): Ringtime[] {
    // Filtering of the ring times according to the current day of the week
    const filteredRingtimes = ringtimes.filter(
      (rt) => (rt as any)[currentDayOfWeek]
    );

    // Filtering of the ring times that have already taken place
    const upcomingRingtimes = filteredRingtimes.filter((rt) => {
      const playTime = this.timeToDate(rt.playTime);
      return playTime >= currentTime;
    });

    // Sorting of the ring times according to the time of the start
    const sortedRingtimes = upcomingRingtimes.sort(
      (a, b) =>
        this.timeToDate(a.playTime).getTime() -
        this.timeToDate(b.playTime).getTime()
    );

    // Return of the sorted ring times
    return sortedRingtimes;
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
}
