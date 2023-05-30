import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DebugElement } from '@angular/core';
import { By } from '@angular/platform-browser';
import { RouterTestingModule } from '@angular/router/testing';

import { DashboardComponent } from './dashboard.component';
import { GridCardsComponent } from '../../components/grid-cards/grid-cards.component';
import { MatCardModule } from '@angular/material/card';
import { AppRoutingModule } from '../../app-routing.module';
import { DashboardIcons, RoutingLinks } from 'src/app/services/store.service';
import { RouterLinkDirectiveStub } from 'src/app/spec-helpers/router-link-directive.stub';

/**
 * @author: Thomas Forjan, Philipp Wildzeiss, Martin Kral
 * @version: 0.0.3
 * @since: April 2023
 * @description: Tests for the dashboard component


/**
 * Test suite for the DashboardComponent.
 */
describe('DashboardComponent', () => {
  let component: DashboardComponent;
  let fixture: ComponentFixture<DashboardComponent>;
  let gridCardsComponent: DebugElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        DashboardComponent,
        GridCardsComponent,
        RouterLinkDirectiveStub,
      ],
      imports: [MatCardModule, AppRoutingModule, RouterTestingModule],
    }).compileComponents();

    fixture = TestBed.createComponent(DashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    gridCardsComponent = fixture.debugElement.query(
      By.directive(GridCardsComponent)
    );
  });

  /**
   * Test case to check if the DashboardComponent is created successfully.
   */
  it('should create', () => {
    expect(component).toBeTruthy();
  });

  /**
   * Test case to check if the grid cards component is rendered.
   */
  it('should render grid cards component', () => {
    expect(gridCardsComponent).toBeTruthy();
  });

  /**
   * Test case to check if the correct input values are passed to the grid cards component.
   */
  it('should pass correct input values to grid cards component', () => {
    const gridCardsInstance =
      gridCardsComponent.componentInstance as GridCardsComponent;
    expect(gridCardsInstance.cards).toBe(6);
    expect(gridCardsInstance.cards_height).toBe(220);
    expect(gridCardsInstance.cards_width).toBe(330);
    expect(gridCardsInstance.hoverActive).toBe(true);
    expect(gridCardsInstance.linkArray).toEqual(component.routerLinks.slice(1));
    expect(gridCardsInstance.matCardContentParagraphs).toEqual(
      component.titles.slice(1)
    );
  });

  /**
   * Test case to check if the correct icon values are passed to the grid cards component.
   */
  it('should pass correct icon values to grid cards component', () => {
    const gridCardsInstance =
      gridCardsComponent.componentInstance as GridCardsComponent;
    expect(gridCardsInstance.icons).toEqual(Object.values(DashboardIcons));
  });

  /**
   * Test case to check if the correct titles are passed to the grid cards component.
   */
  it('should pass correct titles to grid cards component', () => {
    const gridCardsInstance =
      gridCardsComponent.componentInstance as GridCardsComponent;
    const matCardContentParagraphs = gridCardsInstance.matCardContentParagraphs;
    const expectedTitles = component.titles.slice(1);

    expect(matCardContentParagraphs).toBeDefined();
    expect(matCardContentParagraphs!.length).toBe(expectedTitles.length);

    for (let i = 0; i < matCardContentParagraphs!.length; i++) {
      expect(matCardContentParagraphs![i]).toBe(expectedTitles[i]);
    }
  });

  /**
   * Test case to check if the correct router links are passed to the grid cards component.
   */
  it('should navigate to correct route when a grid card is clicked', () => {
    const routerLinks = fixture.debugElement.queryAll(
      By.directive(RouterLinkDirectiveStub)
    );

    // Filter out the music link
    const enumValues = Object.values(RoutingLinks).filter(
      (value) => value !== RoutingLinks.MusicLink
    );

    expect(routerLinks.length).toBe(enumValues.length - 1);

    for (const element of routerLinks) {
      const routerLink = element.injector.get(RouterLinkDirectiveStub);

      expect(routerLink).toBe(element.injector.get(RouterLinkDirectiveStub));

      const routerLinkElement = element.nativeElement as HTMLElement;
      routerLinkElement.click();

      fixture.detectChanges();
    }
  });
});
