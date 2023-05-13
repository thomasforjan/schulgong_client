import {Component, EventEmitter, Input, Output} from '@angular/core';
import {ActivatedRoute, NavigationEnd, Router} from '@angular/router';
import {filter, map} from 'rxjs';

/**
 * @author: Thomas Forjan, Philipp Wildzeiss, Martin Kral
 * @version: 0.0.2
 * @since: April 2023
 * @description: Header component
 */
@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent {
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
   * Constructor for the header component.
   * @param _router router
   * @param _route activated route
   */
  constructor(private _router: Router, private _route: ActivatedRoute) {
    this._router.events
      .pipe(
        filter((event) => event instanceof NavigationEnd),
        map(() => {
          let currentRoute = this._route.root;
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
}
