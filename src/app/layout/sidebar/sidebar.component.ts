/**
- author: Thomas Forjan, Philipp Wildzeiss, Martin Kral
- version: 0.0.1
- date: 31.03.2023
- description: sidebar component
*/

import { Component } from '@angular/core';
import { StoreService } from '../../services/store.service';
import { MenuNames } from '../../services/store.service';
import { MenuIcons } from '../../services/store.service';
import { RoutingLinks } from '../../services/store.service';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss'],
})
export class SidebarComponent {
  constructor(private storeService: StoreService) {}

  /**
   * An array of router links for the sidebar.
   */
  routerLinks: string[] = Object.values(RoutingLinks);

  /**
   * A boolean indicating whether the sidebar is open or closed.
   */
  isOpen = false;

  /**
   * Menu icons from enum in store service
   */
  icons: string[] = Object.values(MenuIcons);

  /**
   * Menu titles from enum in store service
   */
  titles: string[] = Object.values(MenuNames);

  /**
   * Toggle sidebar
   * return void
   */
  toggle(): void {
    this.isOpen = !this.isOpen;
  }
}
