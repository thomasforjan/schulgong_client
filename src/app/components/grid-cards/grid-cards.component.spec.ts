import {ComponentFixture, TestBed} from '@angular/core/testing';

import {GridCardsComponent} from './grid-cards.component';
import {MatCardModule} from "@angular/material/card";
import {AppRoutingModule} from "../../app-routing.module";

/**
 * @author: Thomas Forjan, Philipp Wildzeiss, Martin Kral
 * @version: 0.0.2
 * @since: April 2023
 * @description: Tests for reusable grid-cards component
 */
describe('GridCardsComponent', () => {
  let component: GridCardsComponent;
  let fixture: ComponentFixture<GridCardsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [GridCardsComponent],
      imports: [MatCardModule, AppRoutingModule]
    })
      .compileComponents();

    fixture = TestBed.createComponent(GridCardsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
