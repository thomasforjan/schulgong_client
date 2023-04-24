/**
 - author: Thomas Forjan, Philipp Wildzeiss, Martin Kral
 - version: 0.0.1
 - date: 07.04.2023
 - description: Grid cards component
 */

import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
} from '@angular/core';

@Component({
  selector: 'app-grid-cards',
  templateUrl: './grid-cards.component.html',
  styleUrls: ['./grid-cards.component.scss'],
})
export class GridCardsComponent implements OnChanges {
  /**
   * Defines the number of columns of the grid.
   */
  @Input() columns!: number;

  /**
   * Defines the number of cards of the grid.
   */
  @Input() cards!: number | null;

  /**
   * Defines the width of the cards.
   */
  @Input() cards_width!: number;

  /**
   * Defines the height of the cards.
   */
  @Input() cards_height!: number;

  /**
   * Defines the routing link of the cards.
   */
  @Input() linkArray!: string[];

  /**
   * Defines if the cards should have hover and active color enabled.
   */
  @Input() hoverActive?: boolean;

  /**
   * Defines if the index should be enabled on cards.
   */
  @Input() index?: boolean = false;

  /**
   * Defines the title of the cards.
   */
  @Input() matCardTitle?: string[] | null = [];

  /**
   * Defines the subtitle of the cards.
   */
  @Input() matCardSubtitle?: string[] | null = [];

  /**
   * Defines the paragraphs of the cards.
   */
  @Input() matCardContentParagraph?: string[] | null = [];
  @Input() matCardContentParagraph2?: string[] | null = [];
  @Input() matCardContentParagraph3?: string[] | null = [];

  /**
   * Defines the icon of the cards.
   */
  @Input() icon?: string[] = [];

  /**
   * Defines if the button container should be enabled on cards.
   */
  @Input() showButtonContainer?: boolean = false;

  /**
   * Defines if the edit button should be enabled on cards.
   */
  @Input() showEditButton?: boolean = false;

  /**
   * Defines if the play button should be enabled on cards.
   */
  @Input() showPlayButton?: boolean = false;

  /**
   * Defines if the delete button should be enabled on cards.
   */
  @Input() showDeleteButton?: boolean = false;

  /**
   * Defines the edit EventEmitter of the cards.
   */
  @Output() edit = new EventEmitter<number>();

  /**
   * Defines the play EventEmitter of the cards.
   */
  @Output() play = new EventEmitter<number>();

  /**
   * Defines the delete EventEmitter of the cards.
   */
  @Output() delete = new EventEmitter<number>();

  /**
   * Local property to hold the width of the cards.
   */
  cardWidth: string | null = null;

  /**
   * Local property to hold the height of the cards.
   */
  cardHeight: string | null = null;

  /**
   * Defines the playing state of the cards.
   */
  @Input() playing: boolean[] = [];

  matTooltipText!: string;

  /**
   * Constructor of the GridCardsComponent.
   * @param elRef element reference
   */
  constructor(private elRef: ElementRef) {}

  /**
   * Defines the onChanges method of the GridCardsComponent.
   * @param changes changes of the grid cards component
   */
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['columns']) {
      const gridContainerEl: HTMLElement | null =
        this.elRef.nativeElement.querySelector('.grid-container');
      if (gridContainerEl) {
        gridContainerEl.style.setProperty('--columns', this.columns.toString());
      }
    }
    if (changes['cards_width']) {
      this.cardWidth = `${this.cards_width}px`;
    }
    if (changes['cards_height']) {
      this.cardHeight = `${this.cards_height}px`;
    }
  }

  /**
   * Emits the edit event.
   * @param index of the object
   */
  onEdit(index: number): void {
    this.edit.emit(index);
  }

  /**
   * Toggles the play state of the card.
   * @param index of the object
   */
  togglePlayPause(index: number): void {
    this.play.emit(index);
  }

  /**
   * Emits the play event.
   * @param index of the object
   */
  onPlay(index: number): void {
    this.play.emit(index);
  }

  /**
   * Emits the delete event.
   * @param index of the object
   */
  onDelete(index: number): void {
    this.delete.emit(index);
  }
}
