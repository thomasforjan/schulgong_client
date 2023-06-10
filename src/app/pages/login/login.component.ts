import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';

/**
 * @author: Thomas Forjan, Philipp Wildzeiss, Martin Kral
 * @version: 0.0.1
 * @since: June 2023
 * @description: Login Component
 */

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  /**
   * @description Flag which indicates if login failed
   */
  public loginFailed = false;

  /**
   * @description Error message which is displayed if login failed
   */
  public loginErrorMessage: string | null = null;

  /**
   * @description Flag which indicates if the application is currently loading
   */
  public loadingSpinner = false;

  /**
   * @description Image which is used on Login
   */
  authenticationImage = '../../../assets/images/pages/authentication.svg';

  /**
   * @description Formgroup of authenticationForm
   */
  authenticationForm!: FormGroup;

  /**
   * @description Constructor
   * @param _authService Service for authentication
   * @param _router Router for navigation
   */
  constructor(private _authService: AuthService, private _router: Router) {}

  /**
   * @description Initialize component
   */
  ngOnInit(): void {
    this.authenticationForm = new FormGroup({
      passwordFormControl: new FormControl(''),
    });
  }

  /**
   * @description Permits a login if the login button is clicked
   */
  onLoginClick(): void {
    const password = this.authenticationForm.get('passwordFormControl')?.value;

    this.loadingSpinner = true; // Set loading to true when the login process starts
    this.loginFailed = false; // Set loginFailed to false when the login process starts

    this._authService.login(password).subscribe({
      next: (response) => {
        localStorage.setItem('token', response.token);
        this._router
          .navigate(['/'])
          .then(() => {
            this.loadingSpinner = false; // Set loading to false when navigation is completed
          })
          .catch((err) => {
            console.log('Navigation error: ', err);
            this.loadingSpinner = false; // Set loading to false when navigation is completed
          });
      },
      error: (error) => {
        this.loginFailed = true;
        this.loadingSpinner = false; // Set loading to false when the login process is failed
        this.loginErrorMessage = error.error; // Get error message from server
      },
    });
  }
}
