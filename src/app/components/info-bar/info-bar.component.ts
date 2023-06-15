import {Component, OnInit} from '@angular/core';
import {RoutingLinks, StoreService} from 'src/app/services/store.service';
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
import {LiveBackendService} from "../../services/live.backend.service";
import {Router} from "@angular/router";

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

  togglePlaylistAlarm!: string;
  isAlarmEnabled!: boolean;
  isPlaylistEnabled!: boolean;
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
  protected readonly RoutingLinks = RoutingLinks;

  /**
   * @description Constructor
   * @param _storeService Injected StoreService
   * @param _holidayBackendService Injected Holiday-BackendService
   * @param _ringtimeBackendService Injected Ringtime-BackendService
   * @param _liveBackendServvice Injected Live-BackendService
   * @param _dateUtilsService Injected DateService
   */
  constructor(
    private _storeService: StoreService,
    private _holidayBackendService: HolidayBackendService,
    private _ringtimeBackendService: RingtimeBackendService,
    private _liveBackendServvice: LiveBackendService,
    private _dateUtilsService: DateUtilsService,
    private _router: Router
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
        const nextGong = this.getRightRingtime(ringtimes, currentTimePlusOneMinute);
        // Return an object with the display time of the next gong and the next gong itself


        // fetch state of alarm
        this._liveBackendServvice.getIsPlayingAlarm().subscribe(isAlarm => {
          this._storeService.isAlarmEnabled = isAlarm;
          this.isAlarmEnabled = isAlarm;
        });

        // fetch state of playlist
        this._liveBackendServvice.getIsPlayingPlaylist().subscribe(isPlaylist => {
          this._storeService.isPlaylistEnabled = isPlaylist;
          this.isPlaylistEnabled = isPlaylist;
        });


        if (this._storeService.isAlarmEnabled) {
          this.togglePlaylistAlarm = "ALARM"
        } else if (this._storeService.isPlaylistEnabled) {
          this.togglePlaylistAlarm = "PLAYLIST"
        }

        return {
          displayTime: nextGong.displayItem,
          nextGong: nextGong.ringtime
        };
      }),
      // Update the next gong in the store
      switchMap(({displayTime, nextGong}) =>
        of(displayTime)
      ),
      // Only emit values when the next gong changes
      distinctUntilChanged()
    );
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
   * @description Find the next upcoming ringtime with reference to selected days, period and time
   * @param ringtimes Array of ringtime objects
   * @param currentTime current Time from server
   * @returns object with next upcoming ringtime object and string of displaying time (if no next ringtime, "" returns)
   */
  getRightRingtime(ringtimes: Ringtime[], currentTime: Date) {
    let ringtimesArray: any[] = [];

    ringtimes.forEach((ringtime) => {
      // get boolean, if current ringtime is already added to ringtimesArray
      const exists = ringtimesArray.some(rt => rt.id === ringtime.id)
      // array of boolean, if ringtime fits and with which date the ringtime got checked
      let checkDaysAndPlaytime = this.checkDaysAndPlaytime(ringtime, currentTime);
      if (!exists && checkDaysAndPlaytime[0]) {

        // get date of server
        let today = new Date().getDay()
        this.currentDate$.subscribe(date => {
            today = new Date(date).getDay();
          }
        )

        // if checked date is today, add [ringtime, day, with which ringtime is checked and displaytime]
        // if not, add date to playtime
        if (checkDaysAndPlaytime[1].getDay() == today) {
          ringtimesArray.push([ringtime, checkDaysAndPlaytime[1], ringtime.playTime]);
        } else {
          ringtimesArray.push([ringtime, checkDaysAndPlaytime[1], checkDaysAndPlaytime[1].toLocaleDateString('de-De') + ", " + ringtime.playTime])
        }


      }
    })

    // sort ringtimes first after date, then after time
    ringtimesArray.sort((a, b) => {
      const compareDay = a[1].valueOf() - b[1].valueOf();

      if (compareDay === 0) {
        return a[0].playTime - b[0].playTime;
      }
      return compareDay;
    });

    let displayArray: any[] = [];

    // create new object {ringtime object, displaytime}
    ringtimesArray.forEach(infoItem => {
      displayArray.push({
        ringtime: infoItem[0],
        displayItem: infoItem[2]
      });

    })
    return displayArray.length > 0 ? displayArray[0] : ""
  }

  /**
   * @description check a ringtime object, whether the date or time fits
   * @param ringtime object of ringtime
   * @param currentTime current server time
   * @returns boolean and date with which the ringtime was checked
   */
  checkDaysAndPlaytime(ringtime: Ringtime, currentTime: Date): [boolean, Date] {
    let countDay: Date = new Date();
    let today: Date = new Date();
    this.currentDate$.subscribe(date => {
        countDay = new Date(date);
        today = new Date(date);
      }
    )
    let checkDays: boolean = false;
    let checkPeriod: boolean = false;

    for (let i = 0; i < 4; i++) {
      switch (countDay.getDay()) {
        case 0:
          checkDays = ringtime.sunday;
          break;
        case 1:
          checkDays = ringtime.monday;
          break;
        case 2:
          checkDays = ringtime.tuesday;
          break;
        case 3:
          checkDays = ringtime.wednesday;
          break;
        case 4:
          checkDays = ringtime.thursday;
          break;
        case 5:
          checkDays = ringtime.friday;
          break;
        case 6:
          checkDays = ringtime.saturday;
          break;
        default:
          break;
      }

      if (checkDays && this.checkPeriod(ringtime, countDay)) {
        if (countDay.getDate() !== today.getDate() || this.timeToDate(ringtime.playTime) >= currentTime) {
          checkPeriod = true;
          continue;
        }
      }
      countDay.setDate(countDay.getDate() + 1);
    }
    return [checkPeriod, countDay];
  }

  /**
   * @description check a ringtime object, if given period fits the current day
   * @param ringtime object of ringtime
   * @param today day which have to be checked with period
   * @returns boolean if the day fits
   */
  checkPeriod(ringtime: Ringtime, today: Date): boolean {
    const startDate = new Date(ringtime.startDate);
    const endDate = new Date(ringtime.endDate);
    startDate.setHours(0, 0, 0);
    endDate.setHours(0, 0, 0);
    endDate.setDate(endDate.getDate() + 1);

    return today.valueOf() >= startDate.valueOf() && today.valueOf() <= endDate.valueOf();
  }

  /**
   * @description get to Live-Site if clicking on the alarm-icon
   */
  public onAlarmBtnClick() {
    this._router.navigate([RoutingLinks.LiveLink])
  }

  /**
   * @description get to Music-Site if clicking on the alarm-icon
   */
  public onPlaylistBtnClick() {
    this._router.navigate([RoutingLinks.MusicLink])
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
