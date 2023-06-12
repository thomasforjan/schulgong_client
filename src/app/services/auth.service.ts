import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, timer, Subscription } from 'rxjs';
import { RoutingLinks, StoreService } from './store.service';

/**
 * @author: Thomas Forjan, Philipp Wildzeiss, Martin Kral
 * @version: 0.0.1
 * @since: June 2023
 * @description: Authentication Service
 */

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  /**
   * @description URL for authentication endpoint
   */
  private readonly _AUTH_URL = '/auth';

  /**
   * @description URL for login
   */
  private readonly _LOGIN_URL = '/login';
  /**
   * @description URL for token verification
   */
  private readonly _VERIFY_TOKEN_URL = '/verifyToken';

  /**
   * @description Subscription for token verification
   */
  private tokenVerificationSubscription!: Subscription;

  /**
   * @description Constructor
   * @param _storeService StoreService
   * @param _http http client
   * @param _router router
   */
  constructor(
    private _storeService: StoreService,
    private _http: HttpClient,
    private _router: Router
  ) {}

  /**
   * @description Login with password
   * @param password password
   * @returns Observable of HTTP response
   */
  login(password: string): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    const body = JSON.stringify({ password: password });

    return this._http.post(
      `${this._storeService.BACKEND_URL}${this._AUTH_URL}${this._LOGIN_URL}`,
      body,
      {
        headers: headers,
      }
    );
  }

  /**
   * @description Check if user is logged in
   * @returns boolean
   */
  isLoggedIn(): boolean {
    // Check if there is a valid JWT in local storage
    return !!localStorage.getItem('token');
  }

  /**
   * @description Logout user
   */
  async logout(): Promise<void> {
    localStorage.removeItem('token');
    await this._router.navigate([RoutingLinks.LoginLink]); // navigate to login page after logout
  }

  /**
   * @description Start token verification
   */
  startTokenVerification() {
    const source = timer(1000, 60000); // Check every minute if token is valid
    this.tokenVerificationSubscription = source.subscribe((val) =>
      this.verifyJWT()
    );
  }

  /**
   * @description Stop token verification
   */
  stopTokenVerification() {
    this.tokenVerificationSubscription.unsubscribe();
  }

  /**
   * @description Verify JWT token
   */
  verifyJWT() {
    const token = localStorage.getItem('token');

    const headers = token
      ? new HttpHeaders({ Authorization: token })
      : new HttpHeaders();

    this._http
      .get(
        `${this._storeService.BACKEND_URL}${this._AUTH_URL}${this._VERIFY_TOKEN_URL}`,
        {
          headers,
          observe: 'response',
        }
      )
      .subscribe({
        next: (response) => {},
        error: (error) => {
          if (error.status === 401) {
            //Token is invalid
            this.logout()
              .then(() => {})
              .catch(() => {});
          }
        },
      });
  }

  /**
   * @description Get token from local storage
   * @returns Observable of token
   */
  getToken(): Observable<string> {
    return new Observable<string>((observer) => {
      const intervalId = setInterval(() => {
        const token = localStorage.getItem('token');
        if (token) {
          observer.next(token);
          observer.complete();
          clearInterval(intervalId);
        }
      }, 1000); // Check every second if token is available
    });
  }
}
