import { Injectable } from '@angular/core';
import { Router, RouterStateSnapshot } from '@angular/router';
import { AuthService } from '../services/auth.service';

/**
 * @author: Thomas Forjan, Philipp Wildzeiss, Martin Kral
 * @version: 0.0.1
 * @since: June 2023
 * @description: Auth guard
 */

@Injectable({
  providedIn: 'root',
})
export class AuthGuard {
  /**
   * Constructor
   * @param _authService  Auth service
   * @param _router  Router
   */
  constructor(private _authService: AuthService, private _router: Router) {}

  /**
   * Can activate method if user is logged in or not
   * @param state Router state snapshot
   * @returns boolean
   */
  async canActivate(state: RouterStateSnapshot) {
    const isCurrentUser = this._authService.isLoggedIn();
    if (isCurrentUser) {
      // authorised so return true
      return true;
    }

    // not logged in so redirect to login page with the return url
    await this._router.navigate(['/login'], {
      queryParams: { returnUrl: state.url },
    });
    return false;
  }
}
