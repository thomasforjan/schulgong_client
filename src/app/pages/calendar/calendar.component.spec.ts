import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FullCalendarModule } from '@fullcalendar/angular';
import { EventInput } from '@fullcalendar/core';
import { Subject } from 'rxjs';

import { CalendarComponent } from './calendar.component';
import { StoreService } from 'src/app/services/store.service';
import { Ringtime } from 'src/app/models/Ringtime';
import { HeroImageComponent } from 'src/app/components/hero-image/hero-image.component';
import { Holiday } from 'src/app/models/Holiday';
import { Ringtone } from 'src/app/models/Ringtone';

/**
 * @author: Thomas Forjan, Philipp Wildzeiss, Martin Kral
 * @version: 0.0.2
 * @since: May 2023
 * @description: Models for the calendar component
 */
describe('CalendarComponent', () => {
  let component: CalendarComponent;
  let fixture: ComponentFixture<CalendarComponent>;
  let storeServiceSpy: jasmine.SpyObj<StoreService>;
  let ringtimeSubject: Subject<Ringtime[]>;
  let holidaySubject: Subject<Holiday[]>;

  beforeEach(async () => {
    ringtimeSubject = new Subject<Ringtime[]>();
    holidaySubject = new Subject<Holiday[]>();
    const spy = jasmine.createSpyObj('StoreService', [], {
      ringtimeList$: ringtimeSubject.asObservable(),
      holidayList$: holidaySubject.asObservable(),
    });

    await TestBed.configureTestingModule({
      declarations: [CalendarComponent, HeroImageComponent],
      imports: [FullCalendarModule],
      providers: [{ provide: StoreService, useValue: spy }],
    }).compileComponents();

    fixture = TestBed.createComponent(CalendarComponent);
    fixture.detectChanges();
    component = fixture.componentInstance;
  });

  afterEach(() => {
    ringtimeSubject.complete();
    holidaySubject.complete();
  });

  /**
   * Default Test which checks if the component is created.
   */
  it('should create', () => {
    expect(component).toBeTruthy();
  });

  /**
   * This test ensures that the addRingtimeEvents method correctly adds events to the calendar without
   * duplicating events for the same date. It verifies that each date in the resulting events array has
   * a count of 1, indicating that no second event is added for the same date.
   */
  it('should not add a second event for the same date', () => {
    const dummyRingtone: Ringtone = {
      id: 1,
      name: 'Dummy Ringtone',
      filename: 'dummy.mp3',
      path: '/dummy/path',
      date: '2023-06-01',
      size: 1000,
    };
    // Emit a predefined list of ringtimes
    const ringtimes: Ringtime[] = [
      {
        id: 1,
        name: 'Ringtime 1',
        ringtoneDTO: dummyRingtone,
        startDate: new Date('2023-06-01'),
        endDate: new Date('2023-06-01'),
        playTime: { hours: 0, minutes: 0 }, // Set to any required value
        monday: true,
        tuesday: true,
        wednesday: true,
        thursday: true,
        friday: true,
        saturday: true,
        sunday: true,
      },
      {
        id: 2,
        name: 'Ringtime 2',
        ringtoneDTO: dummyRingtone,
        startDate: new Date('2023-06-01'),
        endDate: new Date('2023-06-01'),
        playTime: { hours: 0, minutes: 0 }, // Set to any required value
        monday: true,
        tuesday: true,
        wednesday: true,
        thursday: true,
        friday: true,
        saturday: true,
        sunday: true,
      },
    ];
    ringtimeSubject.next(ringtimes);

    fixture.detectChanges();

    // Get the events from the calendar
    const events = component.calendarOptions.events as EventInput[];

    // Create a map to count occurrences of dates
    const dateCount = new Map();
    events.forEach((event) => {
      // Ensure the event start is a Date
      if (event.start instanceof Date) {
        const dateString = event.start.toDateString();
        if (!dateCount.has(dateString)) {
          dateCount.set(dateString, 1);
        } else {
          dateCount.set(dateString, dateCount.get(dateString) + 1);
        }
      }
    });

    // Assert that no date has more than one occurrence
    dateCount.forEach((count, date) => {
      expect(count).toBe(1);
    });
  });

  /**
   * This test ensures that the addRingtimeEvents method correctly adds 1 event to the calendar without duplicating events for the same date.
   * It verifies that the resulting events array has a length of 1, indicating that no second event is added for the same date.
   */
  it('should not add events for multiple ringtimes', () => {
    // Define multiple ringtimes with different start and end dates
    const dummyRingtone: Ringtone = {
      id: 1,
      name: 'Dummy Ringtone',
      filename: 'dummy.mp3',
      path: '/dummy/path',
      date: '2023-06-01',
      size: 1000,
    };

    const ringtimes: Ringtime[] = [
      {
        id: 1,
        name: 'Ringtime 1',
        ringtoneDTO: dummyRingtone,
        startDate: new Date('2023-06-01'),
        endDate: new Date('2023-06-01'),
        playTime: { hours: 0, minutes: 0 }, // Set to any required value
        monday: true,
        tuesday: true,
        wednesday: true,
        thursday: true,
        friday: true,
        saturday: true,
        sunday: true,
      },
      {
        id: 2,
        name: 'Ringtime 2',
        ringtoneDTO: dummyRingtone,
        startDate: new Date('2023-06-01'),
        endDate: new Date('2023-06-01'),
        playTime: { hours: 0, minutes: 0 }, // Set to any required value
        monday: true,
        tuesday: true,
        wednesday: true,
        thursday: true,
        friday: true,
        saturday: true,
        sunday: true,
      },
    ];

    // Emit the predefined list of ringtimes
    ringtimeSubject.next(ringtimes);

    // Call the method that adds the events

    fixture.detectChanges();

    // Get the events from the calendar
    const events = component.calendarOptions.events as EventInput[];

    // Assert that the correct number of events is added
    expect(events.length).toBe(1);
  });

  it('should add events for holidays', () => {
    // Define multiple holidays with different start and end dates
    const holidays: Holiday[] = [
      {
        id: 1,
        name: 'New Year',
        startDate: new Date(2023, 0, 1),
        endDate: new Date(2023, 0, 1),
      },
      {
        id: 2,
        name: 'Christmas',
        startDate: new Date(2023, 11, 25),
        endDate: new Date(2023, 11, 25),
      },
    ];
    console.log(holidays);
    // Emit the predefined list of holidays
    holidaySubject.next(holidays);
    fixture.detectChanges();

    // Get the events from the calendar
    const events = component.calendarOptions.events as EventInput[];

    // Assert that the correct number of events is added
    expect(events.length).toBe(2);
  });
});
