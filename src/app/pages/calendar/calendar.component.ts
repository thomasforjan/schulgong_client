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
    contentHeight: 'auto',
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
    // Using a Map to count the ringtimes per day
    let ringtimesPerDay = new Map<string, number>();

    ringtimes.forEach((ringtime: Ringtime) => {
      const startDate = new Date(ringtime.startDate);
      const endDate = new Date(ringtime.endDate);

      for (
        let day = 0;
        day <=
        Math.floor(
          (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24) // The calculation returns the number of full days between two dates (startDate and endDate).
        );
        day++
      ) {
        let date = new Date(startDate);
        date.setDate(date.getDate() + day);
        const dayOfWeek = date.getDay(); // 0 = Sunday, 1 = Monday, ..., 6 = Saturday

        if (this.checkRingtimeDay(ringtime, dayOfWeek)) {
          const dateKey = this.formatDate(date);
          ringtimesPerDay.set(dateKey, (ringtimesPerDay.get(dateKey) ?? 0) + 1);
        }
      }
    });

    // create the events
    const events: EventInput[] = [];
    ringtimesPerDay.forEach((count, dateKey) => {
      if (count > 0) {
        events.push({
          title: `${count} 🔔`,
          start: dateKey,
          end: this.formatDate(
            new Date(new Date(dateKey).setDate(new Date(dateKey).getDate() + 1))
          ),
          backgroundColor: '#F5D259',
        });
      }
    });

    const currentEvents = (this.calendarOptions.events as any[]) || [];
    this.calendarOptions.events = currentEvents.concat(events);
  }

  /**
   * Defines the holidays to be displayed in the calendar
   * @param holidays holidays to add
   */
  addHolidayEvents(holidays: Holiday[]) {
    const events = holidays.map((holiday: Holiday) => {
      const startDate = new Date(holiday.startDate);
      const endDate = new Date(holiday.endDate);
      endDate.setDate(endDate.getDate() + 1); // add one day to include the end date

      return {
        title: holiday.name,
        start: this.formatDate(new Date(startDate)),
        end: this.formatDate(endDate),
        backgroundColor: '#67B602',
        allDay: true, // all day event must be set on holidays otherwise the end date is one day before
      };
    });

    const currentEvents = (this.calendarOptions.events as any[]) || [];
    this.calendarOptions.events = currentEvents.concat(events);
  }

  /**
   * @ description Converts a Date to an ISO string using the local timezone
   * @param date date to convert
   * @returns ISO string of the date in the local timezone
   */
  toLocalISOString(date: Date): string {
    const tzoffset = date.getTimezoneOffset() * 60000; //offset in milliseconds
    return new Date(date.getTime() - tzoffset).toISOString();
  }

  formatDate(date: Date): string {
    return this.toLocalISOString(date).split('T')[0];
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
}
