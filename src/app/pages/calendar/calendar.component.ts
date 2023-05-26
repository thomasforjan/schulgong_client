import { Component, OnDestroy, OnInit } from '@angular/core';
import {
  CalendarOptions,
  DayHeaderContentArg,
  EventInput,
} from '@fullcalendar/core';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import timeGridPlugin from '@fullcalendar/timegrid';
import resourceTimeGridPlugin from '@fullcalendar/timegrid';
import listPlugin from '@fullcalendar/list';
import deLocale from '@fullcalendar/core/locales/de';
import { Holiday } from 'src/app/models/Holiday';
import { Ringtime } from 'src/app/models/Ringtime';
import { HeroImages, StoreService } from 'src/app/services/store.service';
import {
  fromEvent,
  debounceTime,
  distinctUntilChanged,
  map,
  Subscription,
} from 'rxjs';

/**
 * @author: Thomas Forjan, Philipp Wildzeiss, Martin Kral
 * @version: 0.0.3
 * @since: May 2023
 * @description: Calendar component
 */
@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.scss'],
})
export class CalendarComponent implements OnInit, OnDestroy {
  /**
   * @description Observable for the window resize event
   */
  private resizeObservable$ = fromEvent(window, 'resize').pipe(
    debounceTime(200), // Waiting time after last change of window size
    distinctUntilChanged(), // Only emit when the current value is different than the last
    map(() => window.innerWidth) // Map the event to the current window width
  );

  /**
   * @description Subscription to the resize observable
   */
  private resizeSubscription!: Subscription;

  /**
   * all ringtime that are added to the calendar
   */
  private addedRingtimeDates: Date[] = [];

  constructor(private _storeService: StoreService) {}

  /**
   * Calendar Hero Image from enum in store service
   */
  calendarHeroImage: string = HeroImages.CalendarHeroImage;

  /**
   * Calendar options for the fullcalendar.io library
   */
  calendarOptions: CalendarOptions = {
    headerToolbar: {
      left: 'prev,next today',
      center: 'title',
      right: '',
    },
    plugins: [
      dayGridPlugin,
      interactionPlugin,
      timeGridPlugin,
      resourceTimeGridPlugin,
      listPlugin,
    ],
    initialView: 'dayGridMonth',
    events: [],
    eventTimeFormat: {
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      meridiem: false,
    },
    locale: deLocale,
    buttonText: {
      list: 'Übersicht',
    },
    views: {},
  };

  /**
   * @description Updates the content of the day headers based on the provided arguments.
   * @param args - The arguments containing the date and other information for the day header.
   * @returns The formatted content for the day header.
   */
  updateDayHeaderContent = (args: DayHeaderContentArg) => {
    const isWideScreen = window.innerWidth >= 820;

    const options: Intl.DateTimeFormatOptions = {
      weekday: isWideScreen ? 'long' : 'short',
    };

    return args.date.toLocaleDateString('default', options);
  };

  /**
   * @description Lifecycle Hook - ngOnInit - called after the component is initialized
   */
  ngOnInit() {
    this.loadEvents();
    this.resizeSubscription = this.resizeObservable$.subscribe(() => {
      this.calendarOptions.views = {
        dayGrid: {
          dayHeaderContent: this.updateDayHeaderContent,
        },
        timeGrid: {
          dayHeaderContent: this.updateDayHeaderContent,
        },
      };
    });
    this.calendarOptions.views = {
      dayGrid: {
        dayHeaderContent: this.updateDayHeaderContent,
      },
      timeGrid: {
        dayHeaderContent: this.updateDayHeaderContent,
      },
    };
  }

  /**
   * @description Lifecycle Hook - ngOnDestroy - called when the component is destroyed
   */
  ngOnDestroy() {
    this.resizeSubscription.unsubscribe();
  }

  /**
   * @description Event handler for window resize event.
   * Updates the day header content for the dayGrid and timeGrid views in the calendarOptions.
   */
  onWindowResize = () => {
    this.calendarOptions.views = {
      dayGrid: {
        dayHeaderContent: this.updateDayHeaderContent,
      },
      timeGrid: {
        dayHeaderContent: this.updateDayHeaderContent,
      },
    };
  };

  /**
   * @description Add events (ringtimes and holidays) to the calendar
   * Adds the ringtimes and holidays to the calendar
   */
  loadEvents() {
    this._storeService.ringtimeList$.subscribe((ringtimes: Ringtime[]) => {
      this.addRingtimeEvents(ringtimes);
    });

    this._storeService.holidayList$.subscribe((holidays: Holiday[]) => {
      this.addHolidayEvents(holidays);
    });
  }

  /**
   * @description Defines the ringtimes to be displayed in the calendar
   * @param ringtimes ringtimes to add
   */
  addRingtimeEvents(ringtimes: Ringtime[]) {
    const events: EventInput[] = [];

    ringtimes.forEach((ringtime: Ringtime) => {
      const startDate = new Date(ringtime.startDate);
      const endDate = new Date(ringtime.endDate);

      for (
        let date = new Date(startDate);
        date <= endDate;
        date.setDate(date.getDate() + 1)
      ) {
        const dayOfWeek = date.getDay();

        if (this.checkRingtimeDay(ringtime, dayOfWeek)) {
          if (
            !this.addedRingtimeDates.some(
              (addedDate) => addedDate.toDateString() === date.toDateString()
            )
          ) {
            events.push({
              title: '🔔',
              start: new Date(date),
              end: new Date(date),
              backgroundColor: '#F5D259',
            });

            this.addedRingtimeDates.push(new Date(date));
          }
        }
      }
    });

    const currentEvents = (this.calendarOptions.events as any[]) || [];
    this.calendarOptions.events = currentEvents.concat(events);
  }

  /**
   * @description Checks if the ringtime should be displayed for the given day of the week
   * @param ringtime ringtime to check
   * @param dayOfWeek day of the week to check
   * @returns true if the ringtime should be displayed for the given day of the week
   */
  checkRingtimeDay(ringtime: Ringtime, dayOfWeek: number): boolean {
    switch (dayOfWeek) {
      case 0:
        return ringtime.sunday;
      case 1:
        return ringtime.monday;
      case 2:
        return ringtime.tuesday;
      case 3:
        return ringtime.wednesday;
      case 4:
        return ringtime.thursday;
      case 5:
        return ringtime.friday;
      case 6:
        return ringtime.saturday;
      default:
        return false;
    }
  }

  /**
   * Defines the holidays to be displayed in the calendar
   * @param holidays holidays to add
   */
  addHolidayEvents(holidays: Holiday[]) {
    const events = holidays.map((holiday: Holiday) => {
      return {
        title: holiday.name,
        start: holiday.startDate,
        end: holiday.endDate,
        backgroundColor: '#67B602',
      };
    });

    const currentEvents = (this.calendarOptions.events as any[]) || [];
    this.calendarOptions.events = currentEvents.concat(events);
  }
}
