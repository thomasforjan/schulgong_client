import {Component, ElementRef, EventEmitter, Input, OnChanges, Output, SimpleChanges,} from '@angular/core';

/**
 * @author: Thomas Forjan, Philipp Wildzeiss, Martin Kral
 * @version: 0.0.2
 * @since: April 2023
 * @description: Reusable button component
 */
@Component({
  selector: 'app-button',
  templateUrl: './button.component.html',
  styleUrls: ['./button.component.scss'],
})
export class ButtonComponent implements OnChanges {
  /**
   * Defines the disabled state of the button.
   */
  @Input() disabled?: boolean | any;

  /**
   * Defines the width of the button.
   */
  @Input() width?: number | string;

  /**
   * Defines the height of the button.
   */
  @Input() height?: number | string;

  /**
   * Defines the icon of the button.
   */
  @Input() icon?: string;

  /**
   * Defines the text of the button.
   */
  @Input() text?: string;

  /**
   * Defines the background color of the button.
   */
  @Input() bgColor?: string;

  /**
   * Defines if the button should have hover and active color enabled.
   */
  @Input() hoverActive?: boolean;

  /**
   * Defines the hover color of the button.
   */
  @Input() hoverColor?: string;

  /**
   * Defines the active color of the button.
   */
  @Input() activeColor?: string;

  /**
   * Defines the orange box shadow of the button.
   */
  @Input() boxShadow: string =
    '0 4px 4px rgba(242, 157, 56, 0.25), inset 2px 1px 4px rgba(255, 255, 255, 0.25)';

  /**
   * Defines the aria-label text of the button.
   */
  @Input() ariaLabelText?: string;

  /**
   * Defines the tooltip text of the button.
   */
  @Input() tooltipText?: string;

  /**
   * Defines if the button should display the pause icon.
   */
  @Input() playing?: boolean;

  /**
   * Defines the play icon of the button.
   */
  @Input() playIcon?: string;

  /**
   * Defines the pause icon of the button.
   */
  @Input() stopIcon?: string;

  /**
   * Defines a button click event.
   */
  @Output() btnClick = new EventEmitter<Event>();

  /**
   * Constructor of the button component.
   * @param _elRef element reference
   */
  constructor(private _elRef: ElementRef) {}

  /**
   * Defines the onChanges method of the button component.
   * @param changes changes of the button component
   */
  ngOnChanges(changes: SimpleChanges): void {
    const btnEl = this._elRef.nativeElement.querySelector('.btn');
    if (btnEl) {
      btnEl.style.setProperty(
        'width',
        typeof this.width === 'number' ? `${this.width}px` : this.width
      );
      btnEl.style.setProperty(
        'height',
        typeof this.height === 'number' ? `${this.height}px` : this.height
      );
      btnEl.style.backgroundColor = this.bgColor;
      btnEl.style.setProperty('--hover-color', this.hoverColor);
      btnEl.style.setProperty('--active-color', this.activeColor);
      btnEl.style.setProperty('--box-shadow', this.boxShadow);
    }
  }

  /**
   * Defines the click event of the button.
   */
  onClick(event: Event) {
    event.stopPropagation();
    this.btnClick.emit(event);
  }
}
