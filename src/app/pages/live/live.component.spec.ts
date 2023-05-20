import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LiveComponent } from './live.component';
import { HeroImageComponent } from 'src/app/components/hero-image/hero-image.component';
import { ButtonComponent } from 'src/app/components/button/button.component';
import { GridCardsComponent } from 'src/app/components/grid-cards/grid-cards.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { MaterialModule } from 'src/app/material.module';
import { RouterTestingModule } from '@angular/router/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

/**
 * @author: Thomas Forjan, Philipp Wildzeiss, Martin Kral
 * @version: 0.0.2
 * @since: May 2023
 * @description: Tests for the live component
 */
describe('LiveComponent', () => {
  let component: LiveComponent;
  let fixture: ComponentFixture<LiveComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        LiveComponent,
        HeroImageComponent,
        ButtonComponent,
        GridCardsComponent,
      ],
      imports: [
        HttpClientTestingModule,
        MaterialModule,
        RouterTestingModule,
        BrowserAnimationsModule,
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(LiveComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
