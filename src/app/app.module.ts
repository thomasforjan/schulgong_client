import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRoutingModule } from './app-routing.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';

/**
 * Material Module
 */
import { MaterialModule } from './material.module';

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

/**
 * Test Components
 */
import { TestComponent } from './test/test.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { RingtonesComponent } from './pages/ringtones/ringtones.component';
import { RingtimeComponent } from './pages/ringtime/ringtime.component';
import { LiveComponent } from './pages/live/live.component';
import { NoSchoolComponent } from './pages/no-school/no-school.component';
import { CalendarComponent } from './pages/calendar/calendar.component';
import { UserComponent } from './pages/user/user.component';
import {DatePipe} from "@angular/common";
import { AddEditRingtimeComponent } from './pages/ringtime/add-edit-ringtime/add-edit-ringtime.component';
import {MatOptionModule} from "@angular/material/core";
import {MatCheckboxModule} from "@angular/material/checkbox";
import {MatSelectModule} from "@angular/material/select";

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
    NoSchoolComponent,
    CalendarComponent,
    UserComponent,

    TestComponent,
      AddEditRingtimeComponent,  // Test Component
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    MaterialModule,
    HttpClientModule,
    MatOptionModule,
    MatCheckboxModule,
    MatSelectModule,
  ],
  providers: [DatePipe],
  bootstrap: [AppComponent],
})
export class AppModule {}
