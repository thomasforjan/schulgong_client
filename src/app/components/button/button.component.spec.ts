import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { ButtonComponent } from './button.component';
import { MatTooltipModule } from '@angular/material/tooltip';
import { DebugElement, SimpleChange } from '@angular/core';
import { By } from '@angular/platform-browser';

/**
 * @author: Thomas Forjan, Philipp Wildzeiss, Martin Kral
 * @version: 0.0.3
 * @since: April 2023
 * @description: Tests for the Button component
 */
/**
 * @description Suite of tests for the ButtonComponent
 */
describe('ButtonComponent', () => {
  /**
   * @description ButtonComponent reference
   */
  let component: ButtonComponent;

  /**
   * @description ComponentFixture for ButtonComponent
   */
  let fixture: ComponentFixture<ButtonComponent>;

  /**
   * @description DebugElement for the button element
   */
  let buttonDebugElement: DebugElement;

  /**
   * @description Native HTML element for the button
   */
  let buttonNativeElement: HTMLElement;

  /**
   * @description Sets up the TestBed before each async test
   */
  beforeEach(waitForAsync(async () => {
    await TestBed.configureTestingModule({
      declarations: [ButtonComponent],
      imports: [MatTooltipModule],
    }).compileComponents();
  }));

  /**
   * @description Creates the component and sets initial values before each test
   */
  beforeEach(() => {
    fixture = TestBed.createComponent(ButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    buttonDebugElement = fixture.debugElement.query(By.css('.btn'));
    buttonNativeElement = buttonDebugElement.nativeElement;
  });

  /**
   * @description Tests if the component is properly created
   */
  it('should create', () => {
    fixture.detectChanges();
    expect(component).toBeTruthy();
  });

  /**
   * @description Tests if the btnClick event is emitted when the button is clicked
   */
  it('should emit btnClick event on btn click', () => {
    fixture.detectChanges();
    const spy = spyOn(component.btnClick, 'emit');
    buttonNativeElement.click();
    expect(spy).toHaveBeenCalled();
  });

  /**
   * @description Tests if width and height styles are properly applied
   */
  it('should apply width and height styles', () => {
    component.width = '200px';
    component.height = '50px';
    component.ngOnChanges({
      width: new SimpleChange(null, component.width, false),
      height: new SimpleChange(null, component.height, false),
    });
    fixture.detectChanges();
    expect(buttonNativeElement.style.width).toBe('200px');
    expect(buttonNativeElement.style.height).toBe('50px');
  });

  /**
   * @description Tests if the button can be disabled
   */
  it('should disable the btn', () => {
    component.disabled = true;
    fixture.detectChanges();
    expect((buttonNativeElement as HTMLButtonElement).disabled).toBeTruthy();
  });

  /**
   * @description Tests if the tooltip is properly shown
   */
  it('should show the tooltip', () => {
    component.tooltipText = 'Tooltip';
    fixture.detectChanges();
    expect(component.tooltipText).toBe('Tooltip');
  });
});
