import { Component, OnDestroy, OnInit } from '@angular/core';
import { AuthService } from './services/auth.service';

/**
 * @author: Thomas Forjan, Philipp Wildzeiss, Martin Kral
 * @version: 0.0.1
 * @since: June 2023
 * @description: App Component
 */

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit, OnDestroy {
  /**
   * @description Constructor
   * @param _authService AuthService
   */
  constructor(private _authService: AuthService) {}

  /**
   * @description OnInit lifecycle hook
   */
  ngOnInit() {
    this._authService.getToken().subscribe({
      next: () => {
        this._authService.startTokenVerification();
      },
      error: (err) => {
        console.log('Error retrieving token:', err);
      },
    });
  }

  /**
   * @description OnDestroy lifecycle hook
   */
  ngOnDestroy() {
    this._authService.stopTokenVerification();
  }
}
