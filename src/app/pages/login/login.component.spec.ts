import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LoginComponent } from './login.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { ButtonComponent } from 'src/app/components/button/button.component';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatFormFieldModule } from '@angular/material/form-field';
import { ReactiveFormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatTooltipModule } from '@angular/material/tooltip';
import { AuthService } from 'src/app/services/auth.service';
import { Router } from '@angular/router';
import { of, throwError } from 'rxjs';
/**
 * @author: Thomas Forjan, Philipp Wildzeiss, Martin Kral
 * @version: 0.0.1
 * @since: June 2023
 * @description: Login component Karma Test
 */
describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let authService: AuthService;
  let router: Router;
  let loginBtn: HTMLElement;

  // Mock Objects
  const authServiceMock = {
    login: jasmine
      .createSpy('login')
      .and.returnValue(of({ token: 'test-token' })),
  };

  const routerMock = {
    navigate: jasmine
      .createSpy('navigate')
      .and.returnValue(Promise.resolve(true)),
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [LoginComponent, ButtonComponent],
      imports: [
        HttpClientTestingModule,
        MatToolbarModule,
        MatProgressSpinnerModule,
        MatFormFieldModule,
        ReactiveFormsModule,
        MatInputModule,
        BrowserAnimationsModule,
        MatTooltipModule,
      ],
      providers: [
        { provide: AuthService, useValue: authServiceMock },
        { provide: Router, useValue: routerMock },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    authService = TestBed.inject(AuthService);
    router = TestBed.inject(Router);
    fixture.detectChanges();

    loginBtn = fixture.nativeElement.querySelector('.loginBtn');
  });

  /**
   * @description Check if the LoginComponent has been created successfully
   */
  it('should create', () => {
    expect(component).toBeTruthy();
  });

  /**
   * @description Test if Login button is present in the LoginComponent
   */
  it('check login button exist', () => {
    expect(loginBtn.classList.contains('loginBtn')).toBe(true);
  });

  /**
   * @description Test if authService.login is called when onLoginClick is called
   */
  it('should call authService.login when onLoginClick is called', () => {
    component.onLoginClick();
    expect(authService.login).toHaveBeenCalled();
  });

  /**
   * @description Test if router.navigate is called when onLoginClick is called
   */
  it('should navigate to home on successful login', () => {
    authServiceMock.login.and.returnValue(of({ token: 'test-token' }));
    routerMock.navigate.and.returnValue(Promise.resolve(true));
    component.onLoginClick();
    expect(router.navigate).toHaveBeenCalledWith(['/']);
  });

  /**
   * @description Test if loginFailed and errorMessage are set on login error
   */
  it('should set loginFailed and errorMessage on login error', () => {
    authServiceMock.login.and.returnValue(throwError({ error: 'test-error' }));
    component.onLoginClick();
    expect(component.loginFailed).toBeTrue();
    expect(component.loginErrorMessage).toBe('test-error');
  });
});
