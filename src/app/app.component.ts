/**
- author: Thomas Forjan, Philipp Wildzeiss, Martin Kral
- version: 0.0.1
- date: 31.03.2023
- description: App component
*/

import { Component, ViewChild } from '@angular/core';
import { SidebarComponent } from './layout/sidebar/sidebar.component';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
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
