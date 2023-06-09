import { Component, ViewChild } from '@angular/core';
import { SidebarComponent } from './sidebar/sidebar.component';

/**
 * @author: Thomas Forjan, Philipp Wildzeiss, Martin Kral
 * @version: 0.0.1
 * @since: June 2023
 * @description: Layout component
 */
@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.scss'],
})
export class LayoutComponent {
  /**
   * A ViewChild property to reference the SidebarComponent.
   */
  @ViewChild('sidebar') sidebar!: SidebarComponent;

  /**
   * A boolean indicating whether the sidebar is opened or closed.
   */
  sidebarOpened = false;

  /**
     * Toggles the sidebar by calling the toggle method of the SidebarComponent and updating the value of sidebarOpened.
     @returns void
     */
  toggleSidebar(): void {
    this.sidebar.toggle();
    this.sidebarOpened = !this.sidebarOpened;
  }
}
