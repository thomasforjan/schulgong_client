/**
- author: Thomas Forjan, Philipp Wildzeiss, Martin Kral
- version: 0.0.1
- date: 31.03.2023
- description: Header component
*/
import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { filter, map } from 'rxjs';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent {
  /**
   * Constructor for the header component.
   * @param router router
   * @param activatedRoute activated route
   */
  constructor(private router: Router, private route: ActivatedRoute) {
    this.router.events
      .pipe(
        filter((event) => event instanceof NavigationEnd),
        map(() => {
          let currentRoute = this.route.root;
          while (currentRoute.firstChild) {
            currentRoute = currentRoute.firstChild;
          }
          return currentRoute;
        }),
        filter((route) => route.outlet === 'primary')
      )
      .subscribe((route) => {
        this.currentRouteName = route.snapshot.data['title'];
      });
  }

  /**
   * The current route name.
   */
  currentRouteName: string = '';

  /**
   * A boolean input property indicating whether the sidebar is open or closed.
   */
  @Input() isSidebarOpen!: boolean;

  /**
   * An event emitter output property that emits an event to toggle the sidebar.
   */
  @Output() toggleSidenav = new EventEmitter<void>();

  /**
   * Emits an event to toggle the sidebar.
   */
  onToggleSidenav() {
    this.toggleSidenav.emit();
  }
}
