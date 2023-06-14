import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HTTP_INTERCEPTORS, HttpClientModule } from '@angular/common/http';

/**
 * Date Adapter / Date Format
 */
import { MomentDateAdapter } from '@angular/material-moment-adapter';
import {
  DateAdapter,
  MAT_DATE_FORMATS,
  MAT_DATE_LOCALE,
} from '@angular/material/core';

/**
 * Material Module
 */
import { MaterialModule } from './material.module';

/**
 * Full Calendar Module
 */
import { FullCalendarModule } from '@fullcalendar/angular';

/**
 * Components
 */
import { AppComponent } from './app.component';
import { GridCardsComponent } from './components/grid-cards/grid-cards.component';
import { FooterComponent } from './layout/footer/footer.component';
import { HeaderComponent } from './layout/header/header.component';
import { SidebarComponent } from './layout/sidebar/sidebar.component';
import { InfoBarComponent } from './components/info-bar/info-bar.component';
import { ButtonComponent } from './components/button/button.component';
import { HeroImageComponent } from './components/hero-image/hero-image.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { RingtonesComponent } from './pages/ringtones/ringtones.component';
import { RingtimeComponent } from './pages/ringtime/ringtime.component';
import { LiveComponent } from './pages/live/live.component';
import { HolidayComponent } from './pages/holiday/holiday.component';
import { CalendarComponent } from './pages/calendar/calendar.component';
import { SettingsComponent } from './pages/settings/settings.component';
import { AddEditRingtonesComponent } from './pages/ringtones/add-edit-ringtones/add-edit-ringtones.component';
import { DeleteDialogComponent } from './components/delete-dialog/delete-dialog.component';
import { AddEditRingtimeComponent } from './pages/ringtime/add-edit-ringtime/add-edit-ringtime.component';
import { AddEditHolidaysComponent } from './pages/holiday/add-edit-holidays/add-edit-holidays.component';
import { MusicComponent } from './pages/live/music/music.component';
import { ChooseMusicComponent } from './pages/live/music/choose-music/choose-music.component';
import { LoginComponent } from './pages/login/login.component';
import { AuthGuard } from './auth/auth.guard';
import { LayoutComponent } from './layout/layout.component';
import { JwtInterceptor } from './auth/jwt.interceptor';

/**
 * European Date Format DD.MM.YYYY
 */
export const EUROPEAN_DATE_FORMAT = {
  parse: {
    dateInput: ['DD.MM.YYYY', 'DD/MM/YYYY', 'DD-MM-YYYY'],
  },
  display: {
    dateInput: 'DD.MM.YYYY',
    monthYearLabel: 'YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'YYYY',
  },
};

/**
 * @author: Thomas Forjan, Philipp Wildzeiss, Martin Kral
 * @version: 0.0.4
 * @since: April 2023
 * @description: Module for all global declarations and imports
 */
@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    SidebarComponent,
    FooterComponent,
    GridCardsComponent,
    InfoBarComponent,
    ButtonComponent,
    HeroImageComponent,
    DashboardComponent,
    RingtonesComponent,
    RingtimeComponent,
    LiveComponent,
    HolidayComponent,
    CalendarComponent,
    AddEditRingtonesComponent,
    DeleteDialogComponent,
    AddEditRingtimeComponent,
    AddEditHolidaysComponent,
    MusicComponent,
    ChooseMusicComponent,
    SettingsComponent,
    LoginComponent,
    LayoutComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MaterialModule,
    HttpClientModule,
    FullCalendarModule,
  ],
  providers: [
    AuthGuard,
    { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
    {
      provide: DateAdapter,
      useClass: MomentDateAdapter,
      deps: [MAT_DATE_LOCALE],
    },
    { provide: MAT_DATE_FORMATS, useValue: EUROPEAN_DATE_FORMAT },
    { provide: MAT_DATE_LOCALE, useValue: 'de-DE' },
  ],

  bootstrap: [AppComponent],
})
export class AppModule {}
