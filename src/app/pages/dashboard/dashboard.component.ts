/**
 - author: Thomas Forjan, Philipp Wildzeiss, Martin Kral
 - version: 0.0.1
 - date: 12.04.2023
 - description: Dashboard component
 */

import {Component} from '@angular/core';
import {DashboardIcons, MenuNames, RoutingLinks} from '../../services/store.service';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss'],
})
export class DashboardComponent {
  /**
   * Menu titles from enum in store service
   */
  titles: string[] = Object.values(MenuNames);

  /**
   * Router links from enum in store service
   */
  routerLinks: string[] = Object.values(RoutingLinks);

  /**
   * Dashboard icons from enum in store service
   */
  dashboardIcons: string[] = Object.values(DashboardIcons);
}
