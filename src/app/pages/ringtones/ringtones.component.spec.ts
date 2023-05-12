import {ComponentFixture, TestBed} from '@angular/core/testing';

import {RingtonesComponent} from './ringtones.component';
import {HttpClientTestingModule} from "@angular/common/http/testing";
import {MatDialogModule} from "@angular/material/dialog";
import {MatSnackBarModule} from "@angular/material/snack-bar";
import {HeroImageComponent} from "../../components/hero-image/hero-image.component";
import {ButtonComponent} from "../../components/button/button.component";
import {GridCardsComponent} from "../../components/grid-cards/grid-cards.component";
import {MatTooltipModule} from "@angular/material/tooltip";
import {MatIconModule} from "@angular/material/icon";

/**
 * @author: Thomas Forjan, Philipp Wildzeiss, Martin Kral
 * @version: 0.0.2
 * @since: April 2023
 * @description: Tests for the ringtone component
 */
describe('RingtonesComponent', () => {
  let component: RingtonesComponent;
  let fixture: ComponentFixture<RingtonesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [RingtonesComponent, HeroImageComponent, ButtonComponent, GridCardsComponent],
      imports: [HttpClientTestingModule, MatDialogModule, MatSnackBarModule, MatTooltipModule, MatIconModule]
    })
      .compileComponents();

    fixture = TestBed.createComponent(RingtonesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
