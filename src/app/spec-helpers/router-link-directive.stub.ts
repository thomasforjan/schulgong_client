import { Directive, HostListener, Input } from '@angular/core';

/**
 * @author: Thomas Forjan, Philipp Wildzeiss, Martin Kral
 * @version: 0.0.1
 * @since: May 2023
 * @description: Stub for the RouterLinkDirective
 */
@Directive({
  selector: '[routerLink]',
})
export class RouterLinkDirectiveStub {
  /**
   * @description: Input for the routerLink directive
   */
  @Input('routerLink') linkParams: any;

  /**
   * @description: Property to store the navigated to value
   */
  navigatedTo: any = null;

  /**
   * @description: HostListener for the click event
   */
  @HostListener('click')

  /**
   * @description: Method to handle the click event
   */
  onClick() {
    this.navigatedTo = this.linkParams;
  }
}
