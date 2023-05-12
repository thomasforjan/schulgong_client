import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {MenuNames, RoutingLinks, TabTitleNames} from './services/store.service';

import {DashboardComponent} from './pages/dashboard/dashboard.component';
import {RingtonesComponent} from './pages/ringtones/ringtones.component';
import {LiveComponent} from './pages/live/live.component';
import {CalendarComponent} from './pages/calendar/calendar.component';
import {UserComponent} from './pages/user/user.component';
import {HolidayComponent} from './pages/holiday/holiday.component';
import {RingtimeComponent} from './pages/ringtime/ringtime.component';

/**
 * @author: Thomas Forjan, Philipp Wildzeiss, Martin Kral
 * @version: 0.0.2
 * @since: April 2023
 * @description: Routing module for all routes
 */
const routes: Routes = [
  {
    path: RoutingLinks.DashboardLink,
    component: DashboardComponent,
    data: {title: MenuNames.Dashboard},
    title: TabTitleNames.Schulgong + TabTitleNames.Dashboard,
  },
  {
    path: RoutingLinks.RingtonesLink,
    component: RingtonesComponent,
    data: {title: MenuNames.Ringtones},
    title: TabTitleNames.Schulgong + TabTitleNames.Ringtones,
  },
  {
    path: RoutingLinks.RingtimeLink,
    component: RingtimeComponent,
    data: {title: MenuNames.Ringtime},
    title: TabTitleNames.Schulgong + TabTitleNames.Ringtime,
  },
  {
    path: RoutingLinks.LiveLink,
    component: LiveComponent,
    data: {title: MenuNames.Live},
    title: TabTitleNames.Schulgong + TabTitleNames.Live,
  },
  {
    path: RoutingLinks.HolidayLink,
    component: HolidayComponent,
    data: {title: MenuNames.Holiday},
    title: TabTitleNames.Schulgong + TabTitleNames.Holiday,
  },
  {
    path: RoutingLinks.CalendarLink,
    component: CalendarComponent,
    data: {title: MenuNames.Calendar},
    title: TabTitleNames.Schulgong + TabTitleNames.Calendar,
  },
  {
    path: RoutingLinks.UserLink,
    component: UserComponent,
    data: {title: MenuNames.User},
    title: TabTitleNames.Schulgong + TabTitleNames.User,
  },

  // otherwise redirect to dashboard ('/')
  {path: '**', redirectTo: ''},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {
}
