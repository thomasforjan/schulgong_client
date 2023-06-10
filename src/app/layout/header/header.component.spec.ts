import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HeaderComponent } from './header.component';
import { RouterTestingModule } from '@angular/router/testing';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { AuthService } from 'src/app/services/auth.service';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { of } from 'rxjs';
import { NO_ERRORS_SCHEMA } from '@angular/core';

/**
 * @author: Thomas Forjan, Philipp Wildzeiss, Martin Kral
 * @version: 0.0.2
 * @since: April 2023
 * @description: Tests for the header component
 */
describe('HeaderComponent', () => {
  let component: HeaderComponent;
  let fixture: ComponentFixture<HeaderComponent>;
  let authService: AuthService;
  let router: any;
  let activatedRoute: ActivatedRoute;

  // Mock Objects
  const authServiceMock = {
    logout: jasmine.createSpy('logout'),
  };

  const routerMock = {
    navigate: jasmine
      .createSpy('navigate')
      .and.returnValue(Promise.resolve(true)),
    events: of(
      new NavigationEnd(
        0,
        'http://localhost:4200/dashboard',
        'http://localhost:4200/dashboard'
      )
    ),
  };

  const activatedRouteMock = {
    root: {
      firstChild: {
        outlet: 'primary',
        snapshot: {
          data: { title: 'Dashboard' },
        },
      },
    },
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [HeaderComponent],
      imports: [
        HttpClientTestingModule,
        RouterTestingModule,
        MatToolbarModule,
        MatIconModule,
        MatMenuModule,
      ],
      providers: [
        { provide: AuthService, useValue: authServiceMock },
        { provide: Router, useValue: routerMock },
        { provide: ActivatedRoute, useValue: activatedRouteMock },
      ],
      schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(HeaderComponent);
    component = fixture.componentInstance;
    authService = TestBed.inject(AuthService);
    router = TestBed.inject(Router);
    fixture.detectChanges();
  });

  /**
   * @description: Test if the header component is created
   */
  it('should create', () => {
    expect(component).toBeTruthy();
  });

  /**
   * @description: Test if the authService.logout and router.navigate are called when onLogout is called
   */
  it('should call authService.logout and router.navigate when onLogout is called', () => {
    component.onLogout();
    expect(authService.logout).toHaveBeenCalled();
    expect(router.navigate).toHaveBeenCalledWith(['/login']);
  });

  /**
   * @description: Test if the currentRouteName is set correctly
   */
  it('should update currentRouteName when a navigation end event occurs', () => {
    expect(component.currentRouteName).toBe('Dashboard');
  });
});
