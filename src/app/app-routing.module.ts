import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {
  MenuNames,
  RoutingLinks,
  TabTitleNames,
} from './services/store.service';

import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { RingtonesComponent } from './pages/ringtones/ringtones.component';
import { LiveComponent } from './pages/live/live.component';
import { CalendarComponent } from './pages/calendar/calendar.component';
import { SettingsComponent } from './pages/settings/settings.component';
import { HolidayComponent } from './pages/holiday/holiday.component';
import { RingtimeComponent } from './pages/ringtime/ringtime.component';
import { MusicComponent } from './pages/live/music/music.component';
import { LoginComponent } from './pages/login/login.component';
import { AuthGuard } from './auth/auth.guard';
import { LayoutComponent } from './layout/layout.component';

/**
 * @author: Thomas Forjan, Philipp Wildzeiss, Martin Kral
 * @version: 0.0.3
 * @since: April 2023
 * @description: Routing module for all routes
 */
const routes: Routes = [
  {
    path: RoutingLinks.LoginLink,
    component: LoginComponent,
    title: TabTitleNames.Schulgong + TabTitleNames.Login,
  },
  {
    path: '',
    component: LayoutComponent,
    canActivate: [AuthGuard],
    children: [
      {
        path: RoutingLinks.DashboardLink,
        component: DashboardComponent,
        data: { title: MenuNames.Dashboard },
        title: TabTitleNames.Schulgong + TabTitleNames.Dashboard,
      },
      {
        path: RoutingLinks.DashboardLink,
        component: DashboardComponent,
        data: { title: MenuNames.Dashboard },
        title: TabTitleNames.Schulgong + TabTitleNames.Dashboard,
      },
      {
        path: RoutingLinks.RingtonesLink,
        component: RingtonesComponent,
        data: { title: MenuNames.Ringtones },
        title: TabTitleNames.Schulgong + TabTitleNames.Ringtones,
      },
      {
        path: RoutingLinks.RingtimeLink,
        component: RingtimeComponent,
        data: { title: MenuNames.Ringtime },
        title: TabTitleNames.Schulgong + TabTitleNames.Ringtime,
      },
      {
        path: RoutingLinks.LiveLink,
        component: LiveComponent,
        data: { title: MenuNames.Live },
        title: TabTitleNames.Schulgong + TabTitleNames.Live,
      },
      {
        path: RoutingLinks.HolidayLink,
        component: HolidayComponent,
        data: { title: MenuNames.Holiday },
        title: TabTitleNames.Schulgong + TabTitleNames.Holiday,
      },
      {
        path: RoutingLinks.CalendarLink,
        component: CalendarComponent,
        data: { title: MenuNames.Calendar },
        title: TabTitleNames.Schulgong + TabTitleNames.Calendar,
      },
      {
        path: RoutingLinks.SettingsLink,
        component: SettingsComponent,
        data: { title: MenuNames.Settings },
        title: TabTitleNames.Schulgong + TabTitleNames.Settings,
      },
      {
        path: RoutingLinks.MusicLink,
        component: MusicComponent,
        data: { title: MenuNames.Music },
        title: TabTitleNames.Schulgong + TabTitleNames.Music,
      },
    ],
  },

  // otherwise redirect to dashboard ('/')
  { path: '**', redirectTo: '' },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
