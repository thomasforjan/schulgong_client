import {ComponentFixture, fakeAsync, TestBed} from '@angular/core/testing';

import {HolidayComponent} from './holiday.component';
import {HttpClientTestingModule} from "@angular/common/http/testing";
import {HeroImageComponent} from "../../components/hero-image/hero-image.component";
import {ButtonComponent} from "../../components/button/button.component";
import {GridCardsComponent} from "../../components/grid-cards/grid-cards.component";
import {Holiday} from "../../models/Holiday";


import {of} from "rxjs";
import {RouterTestingModule} from "@angular/router/testing";
import {MaterialModule} from "../../material.module";
import {HarnessLoader} from "@angular/cdk/testing";
import {TestbedHarnessEnvironment} from "@angular/cdk/testing/testbed";
import {MatCardHarness, MatCardSection} from "@angular/material/card/testing";
import {findComponent} from '../../spec-helpers/element.spec-helper';
import {MatDialogHarness} from "@angular/material/dialog/testing";
import {AddEditHolidaysComponent} from "./add-edit-holidays/add-edit-holidays.component";
import {BrowserAnimationsModule} from "@angular/platform-browser/animations";
import {By} from "@angular/platform-browser";
import {HolidayBackendService} from "../../services/holiday.backend.service";


/**
 * @author: Thomas Forjan, Philipp Wildzeiss, Martin Kral
 * @version: 0.0.2
 * @since: May 2023
 * @description: Tests for the holidays component
 */
describe('HolidayComponent', () => {
  let component: HolidayComponent;
  let fixture: ComponentFixture<HolidayComponent>;
  let getHolidaySpy: jasmine.Spy;
  let holidayUploadBtn: HTMLElement;
  let testHoliday: Holiday[];

  let loader: HarnessLoader;

  beforeEach(async () => {

    testHoliday = [{
      id: 1,
      name: "Sommerferien",
      startDate: new Date(2023, 7, 5),
      endDate: new Date(2023, 9, 1)
    },
      {
        id: 2,
        name: "Semesterferien",
        startDate: new Date(2023, 2, 5),
        endDate: new Date(2023, 2, 13)
      }
    ];

    // Create a fake TwainService object with a `getQuote()` spy
    const holidayBackendService = jasmine.createSpyObj('HolidayBackendService', ['getHolidayResponse']);
    // Make the spy return a synchronous Observable with the test data
    getHolidaySpy = holidayBackendService.getHolidayResponse.and.returnValue(of(testHoliday));

    await TestBed.configureTestingModule({
      declarations: [HolidayComponent, HeroImageComponent, ButtonComponent, GridCardsComponent, AddEditHolidaysComponent],
      // imports: [HttpClientTestingModule, MatDialogModule, MatSnackBarModule, MatTooltipModule, MatIconModule, MatCardModule, RouterTestingModule],
      imports: [HttpClientTestingModule, MaterialModule, RouterTestingModule, BrowserAnimationsModule],
      providers: [{provide: HolidayBackendService, useValue: holidayBackendService}]
    }).compileComponents();

    fixture = TestBed.createComponent(HolidayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();  // onInit()
    loader = TestbedHarnessEnvironment.documentRootLoader(fixture);
    holidayUploadBtn = fixture.nativeElement.querySelector('.uploadBtn')

  });
  describe('holiday overview test', () => {
    it('check getHolidayResponse called', async () => {
      expect(getHolidaySpy.calls.any())
        .withContext('getHolidayResponse called')
        .toBe(true);
    });

    it('check card-header exist', async () => {
      const card = await loader.getHarness(MatCardHarness.with({title: testHoliday[0].name}));
      const footerSubcomponents = (await card.getAllChildLoaders(MatCardSection.HEADER)) ?? [];
      expect(footerSubcomponents.length).toBe(1);
    });

    it('check card-content exist', async () => {
      const card = await loader.getHarness(MatCardHarness.with({title: testHoliday[0].name}));
      const contentSubcomponents = (await card.getAllChildLoaders(MatCardSection.CONTENT)) ?? [];
      expect(contentSubcomponents.length).toBe(1);
    });

    it('check card-action exist', async () => {
      const card = await loader.getHarness(MatCardHarness.with({title: testHoliday[0].name}));
      const footerSubcomponents = (await card.getAllChildLoaders(MatCardSection.ACTIONS)) ?? [];
      expect(footerSubcomponents.length).toBe(1);
    });

    // The quote would not be immediately available if the service were truly async.
    it('check upload button exist', () => {
      expect(holidayUploadBtn.title).toBe('uploadBtn');
      expect(getHolidaySpy.calls.any())
        .withContext('getHolidayResponse called')
        .toBe(true);
    });

    it('click upload button and check if dialog exist', fakeAsync(async () => {
      holidayUploadBtn.click();
      // sync spy result shows testQuote immediately after init
      fixture.detectChanges();  // onInit()
      const dialog = await loader.getAllHarnesses(MatDialogHarness); // fails here
      expect(dialog.length).toBe(1);
    }));

    it('check card-title',  () => {
      const ourDomCardsUnderTest = Array.from(
        document.getElementsByTagName('mat-card')
      );
      let i = 0;
      ourDomCardsUnderTest.forEach(card => {
        const cardTitle = card.getElementsByTagName('mat-card-title')[0]
          .textContent;
        expect(cardTitle).toBe(testHoliday[i].name);
        i++;
      });
    });

    it('check card-content',  async () => {
      const ourDomCardsUnderTest = Array.from(
        document.getElementsByTagName('mat-card')
      );
      let i = 0;
      ourDomCardsUnderTest.forEach(card => {
        const cardContent = card.getElementsByTagName('mat-card-content')[0]
          .textContent;
        if(cardContent != null) {
          expect(cardContent.trim()).toBe(testHoliday[i].startDate.toLocaleDateString('de-DE', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
          }) + " - " + testHoliday[i].endDate.toLocaleDateString('de-DE', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
          }));
        }
        i++;
      });
    });

    it('check if app-grid-cards component exist', () => {
      const el = findComponent(fixture, 'app-grid-cards');
      expect(el).toBeTruthy();
    });

    it('check correct cards button exist', fakeAsync(async () => {
      const el = findComponent(fixture, 'app-grid-cards');
      // First get the DebugElement
      const gridCardDebugEl = fixture.debugElement.query(By.directive(GridCardsComponent));
      // Then get the component
      const gridCardssComponent = gridCardDebugEl.injector.get(GridCardsComponent);
      expect(gridCardssComponent.showEditButton).toBe(true);
      expect(gridCardssComponent.showPlayButton).toBe(false);
      expect(gridCardssComponent.showDeleteButton).toBe(true);
    }));

    it('check onclick delete button', fakeAsync(async () => {
      const el = findComponent(fixture, 'app-grid-cards');
      // First get the DebugElement
      const gridCardDebugEl = fixture.debugElement.query(By.directive(GridCardsComponent));
      // Then get the component
      const gridCardssComponent = gridCardDebugEl.injector.get(GridCardsComponent);
      let i = 1;
      testHoliday.forEach(holiday => {
        gridCardssComponent.onDelete(testHoliday[0].id);
      });
      const dialog = await loader.getAllHarnesses(MatDialogHarness); // fails here
      expect(dialog.length).toBe(testHoliday.length);
    }));


  });


  it('should create', () => {
    expect(component).toBeTruthy();
  });
});


