import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { filter, map } from 'rxjs';
import { AuthService } from 'src/app/services/auth.service';

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
   * @description The current route name.
   */
  currentRouteName: string = '';

  /**
   * @description A boolean input property indicating whether the sidebar is open or closed.
   */
  @Input() isSidebarOpen!: boolean;

  /**
   * @description An event emitter output property that emits an event to toggle the sidebar.
   */
  @Output() toggleSidenav = new EventEmitter<void>();

  /**
   * @description Constructor for the header component.
   * @param _router router
   * @param _route activated route
   * @param _authService auth service
   */
  constructor(
    private _router: Router,
    private _route: ActivatedRoute,
    private _authService: AuthService
  ) {
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

  /**
   * @description Method to invoke logout and switch route.
   */
  onLogout() {
    this._authService.logout();
    this._router.navigate(['/login']).catch(() => {});
  }
}
