/**
- author: Thomas Forjan, Philipp Wildzeiss, Martin Kral
- version: 0.0.1
- date: 06.04.2023
- description: Button component
*/
import {
  Component,
  Input,
  ElementRef,
  OnChanges,
  SimpleChanges,
  Output,
  EventEmitter,
} from '@angular/core';

@Component({
  selector: 'app-button',
  templateUrl: './button.component.html',
  styleUrls: ['./button.component.scss'],
})
export class ButtonComponent implements OnChanges {
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
   * Defines the tooltip text of the button.
   */
  @Input() tooltipText?: string;

  /**
   * Defines a button click event.
   */
  @Output() btnClick = new EventEmitter<void>();

  /**
   * Constructor of the button component.
   * @param elRef element reference
   */
  constructor(private elRef: ElementRef) {}

  /**
   * Defines the onChanges method of the button component.
   * @param changes changes of the button component
   */
  ngOnChanges(changes: SimpleChanges): void {
    const btnEl = this.elRef.nativeElement.querySelector('.btn');
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
    }
  }

  /**
   * Defines the click event of the button.
   */
  onClick(): void {
    this.btnClick.emit();
  }
}
