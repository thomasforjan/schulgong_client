import {Component} from '@angular/core';
import {MenuIcons, MenuNames, RoutingLinks} from '../../services/store.service';

/**
 * @author: Thomas Forjan, Philipp Wildzeiss, Martin Kral
 * @version: 0.0.2
 * @since: April 2023
 * @description: Sidebar component
 */
@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss'],
})
export class SidebarComponent {
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
