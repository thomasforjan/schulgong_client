import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';
import {MenuNames, RoutingLinks} from './services/store.service';

import {TestComponent} from './test/test.component';
import {DashboardComponent} from './pages/dashboard/dashboard.component';
import {RingtonesComponent} from './pages/ringtones/ringtones.component';
import {LiveComponent} from './pages/live/live.component';
import {CalendarComponent} from './pages/calendar/calendar.component';
import {UserComponent} from './pages/user/user.component';
import {HolidayComponent} from './pages/holiday/holiday.component';
import {RingtimeComponent} from './pages/ringtime/ringtime.component';

const routes: Routes = [
  {
    path: RoutingLinks.DashboardLink,
    component: DashboardComponent,
    data: {title: MenuNames.Dashboard},
  },
  {
    path: RoutingLinks.RingtonesLink,
    component: RingtonesComponent,
    data: {title: MenuNames.Ringtones},
  },
  {
    path: RoutingLinks.RingtimeLink,
    component: RingtimeComponent,
    data: { title: MenuNames.Ringtime },
  },
  {
    path: RoutingLinks.LiveLink,
    component: LiveComponent,
    data: {title: MenuNames.Live},
  }, {
    path: RoutingLinks.HolidayLink, component: HolidayComponent, data: {title: MenuNames.Holiday},
  },
  {
    path: RoutingLinks.CalendarLink,
    component: CalendarComponent,
    data: {title: MenuNames.Calendar},
  },
  {
    path: RoutingLinks.UserLink,
    component: UserComponent,
    data: {title: MenuNames.User},
  },

  // test route
  {path: 'test', component: TestComponent},

  // otherwise redirect to dashboard ('/')
  {path: '**', redirectTo: ''},
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {
}
