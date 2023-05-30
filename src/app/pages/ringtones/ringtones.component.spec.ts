import { ComponentFixture, TestBed, fakeAsync } from '@angular/core/testing';
import { RingtonesComponent } from './ringtones.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { HeroImageComponent } from '../../components/hero-image/hero-image.component';
import { ButtonComponent } from '../../components/button/button.component';
import { GridCardsComponent } from '../../components/grid-cards/grid-cards.component';
import { MatCardModule } from '@angular/material/card';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { StoreService } from '../../services/store.service';
import { Ringtone } from '../../models/Ringtone';
import { DateUtilsService } from '../../services/date-utils.service';
import { UtilsService } from '../../services/utils.service';
import { RingtoneBackendService } from '../../services/ringtone.backend.service';
import { RouterTestingModule } from '@angular/router/testing';
import { By } from '@angular/platform-browser';
import {
  MatDialog,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatIconModule } from '@angular/material/icon';
import { HarnessLoader } from '@angular/cdk/testing';
import { TestbedHarnessEnvironment } from '@angular/cdk/testing/testbed';
import { MatCardHarness, MatCardSection } from '@angular/material/card/testing';
import { of } from 'rxjs';

/**
 * @author: Thomas Forjan, Philipp Wildzeiss, Martin Kral
 * @version: 0.0.3
 * @since: April 2023
 * @description: Tests for the ringtones component
 */

/**
 * @description
 * Suite of tests for the RingtonesComponent
 */
describe('RingtonesComponent', () => {
  let component: RingtonesComponent;
  let fixture: ComponentFixture<RingtonesComponent>;
  let getRingtoneSpy: jasmine.Spy;
  let storeServiceSpy: jasmine.SpyObj<StoreService>;
  let ringtoneUploadBtn: HTMLElement;
  let testRingtone: Ringtone[];
  let loader: HarnessLoader;
  let dialog: MatDialog;

  beforeEach(async () => {
    const ringtoneList: Ringtone[] = [
      {
        id: 1,
        name: 'Ringtone 1',
        filename: 'ringtone1.mp3',
        path: '/path/to/ringtone1.mp3',
        date: '2022-01-01',
        size: 5,
      },
      {
        id: 2,
        name: 'Ringtone 2',
        filename: 'ringtone2.mp3',
        path: '/path/to/ringtone2.mp3',
        date: '2022-02-02',
        size: 7,
      },
    ];
    testRingtone = ringtoneList; // Update the value of testRingtone
    const spy = jasmine.createSpyObj('StoreService', ['ringtoneList$'], {
      ringtoneList$: of(ringtoneList),
    });

    await TestBed.configureTestingModule({
      declarations: [
        RingtonesComponent,
        HeroImageComponent,
        ButtonComponent,
        GridCardsComponent,
      ],
      imports: [
        HttpClientTestingModule,
        MatDialogModule,
        MatSnackBarModule,
        MatTooltipModule,
        MatIconModule,
        MatCardModule,
        BrowserAnimationsModule,
        RouterTestingModule,
      ],
      providers: [
        DateUtilsService,
        UtilsService,
        RingtoneBackendService,
        { provide: StoreService, useValue: spy },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(RingtonesComponent);
    component = fixture.componentInstance;

    fixture.detectChanges();
    loader = TestbedHarnessEnvironment.documentRootLoader(fixture);

    ringtoneUploadBtn = fixture.nativeElement.querySelector('.uploadBtn');
    dialog = TestBed.inject(MatDialog);
  });

  /**
   * @description Check if the RingtonesComponent has been created successfully
   */
  it('should create', () => {
    expect(component).toBeTruthy();
  });

  /**
   * @description Test if the number of cards matches the number of ringtones
   */
  it('should display the correct number of cards', () => {
    fixture.detectChanges();

    const gridCardsComponent = fixture.debugElement.query(
      By.directive(GridCardsComponent)
    ).componentInstance;

    expect(gridCardsComponent.cards).toBe(2);
  });

  /**
   * @description Check if card header exists in the first card
   */
  it('check card-header exist', async () => {
    const card = await loader.getHarness(
      MatCardHarness.with({ title: testRingtone[0].name })
    );
    const footerSubcomponents =
      (await card.getAllChildLoaders(MatCardSection.HEADER)) ?? [];
    expect(footerSubcomponents.length).toBe(1);
  });

  /**
   * @description Check if card content exists in the first card
   */
  it('check card-content exist', async () => {
    const card = await loader.getHarness(
      MatCardHarness.with({ title: testRingtone[0].name })
    );
    const contentSubcomponents =
      (await card.getAllChildLoaders(MatCardSection.CONTENT)) ?? [];
    expect(contentSubcomponents.length).toBe(1);
  });

  /**
   * @description Check if card actions exist in the first card
   */
  it('check card-action exist', async () => {
    const card = await loader.getHarness(
      MatCardHarness.with({ title: testRingtone[0].name })
    );
    const footerSubcomponents =
      (await card.getAllChildLoaders(MatCardSection.ACTIONS)) ?? [];
    expect(footerSubcomponents.length).toBe(1);
  });

  /**
   * @description Test if upload button is present in the RingtonesComponent
   */
  it('check upload button exist', () => {
    expect(ringtoneUploadBtn.classList.contains('uploadBtn')).toBe(true);
  });

  /**
   * @description Test if the card buttons are displayed correctly
   */
  it('should display correct card buttons', fakeAsync(async () => {
    const gridCardDebugEl = fixture.debugElement.query(
      By.directive(GridCardsComponent)
    );

    const gridCardssComponent =
      gridCardDebugEl.injector.get(GridCardsComponent);
    expect(gridCardssComponent.showEditButton).toBe(true);
    expect(gridCardssComponent.showPlayButton).toBe(true);
    expect(gridCardssComponent.showDeleteButton).toBe(true);
  }));

  /**
   * @description Test if the add ringtone dialog opens when the add button is clicked
   */
  it('should open the add ringtone dialog when the add button is clicked', fakeAsync(() => {
    // Arrange
    const dialogRefSpyObj = jasmine.createSpyObj({ afterClosed: of(null) });
    const dialogSpy = spyOn(TestBed.inject(MatDialog), 'open').and.returnValue(
      dialogRefSpyObj as MatDialogRef<unknown, unknown>
    );

    // Create a debug element reference for the button
    const buttonDebugElement = fixture.debugElement.query(
      By.directive(ButtonComponent)
    );
    // Create an instance reference for the button
    const buttonComponent =
      buttonDebugElement.componentInstance as ButtonComponent;

    // Act
    buttonComponent.onClick(new Event('click'));
    fixture.detectChanges();

    // Assert
    expect(dialogSpy).toHaveBeenCalled();
  }));

  /**
   * @description Test if the edit ringtone dialog opens when the edit button is clicked
   */
  it('should open the edit ringtone dialog when the edit button is clicked', fakeAsync(() => {
    // Arrange
    const dialogRefSpyObj = jasmine.createSpyObj({ afterClosed: of(null) });
    const dialogSpy = spyOn(TestBed.inject(MatDialog), 'open').and.returnValue(
      dialogRefSpyObj as MatDialogRef<unknown, unknown>
    );
    const index = 0; // Set the index of the ringtone to be edited

    // Act
    component.onEditRingtone(index);

    // Assert
    expect(dialogSpy).toHaveBeenCalled();
  }));

  /**
   * @description Test if the delete ringtone dialog opens when the delete button is clicked
   */
  it('should open the delete ringtone dialog when the delete button is clicked', () => {
    // Arrange
    const dialogRefSpyObj = jasmine.createSpyObj({ afterClosed: of(null) });
    const dialogSpy = spyOn(TestBed.inject(MatDialog), 'open').and.returnValue(
      dialogRefSpyObj as MatDialogRef<unknown, unknown>
    );

    // Create a debug element reference for the button
    const buttonDebugElement = fixture.debugElement.query(
      By.directive(ButtonComponent)
    );
    // Create an instance reference for the button
    const buttonComponent =
      buttonDebugElement.componentInstance as ButtonComponent;

    // Simulate the click event
    buttonComponent.onClick(new Event('click'));
    fixture.detectChanges();

    // Assert
    expect(dialogSpy).toHaveBeenCalled();
  });
});
