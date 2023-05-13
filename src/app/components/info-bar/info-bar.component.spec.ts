import {ComponentFixture, TestBed} from '@angular/core/testing';

import {InfoBarComponent} from './info-bar.component';
import {ButtonComponent} from "../button/button.component";
import {MatTooltipModule} from "@angular/material/tooltip";
import {MatIconModule} from "@angular/material/icon";

/**
 * @author: Thomas Forjan, Philipp Wildzeiss, Martin Kral
 * @version: 0.0.2
 * @since: April 2023
 * @description: Tests for info-bar component
 */
describe('InfoBarComponent', () => {
  let component: InfoBarComponent;
  let fixture: ComponentFixture<InfoBarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [InfoBarComponent, ButtonComponent],
      imports: [MatTooltipModule, MatIconModule]
    })
      .compileComponents();

    fixture = TestBed.createComponent(InfoBarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
