import {
  Component,
  EventEmitter,
  Input,
  OnChanges,
  Output,
  SimpleChanges,
} from '@angular/core';
import { RoutingLinks } from 'src/app/services/store.service';

/**
 * @author: Thomas Forjan, Philipp Wildzeiss, Martin Kral
 * @version: 0.0.3
 * @since: April 2023
 * @description: Reusable grid-cards component
 */
@Component({
  selector: 'app-grid-cards',
  templateUrl: './grid-cards.component.html',
  styleUrls: ['./grid-cards.component.scss'],
})
export class GridCardsComponent implements OnChanges {
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
  @Input() matCardContentParagraphs?: string[] | null = [];
  @Input() matCardContentParagraphs2?: string[] | null = [];
  @Input() matCardContentParagraphs3?: string[] | null = [];

  /**
   * Defines the icons of the cards.
   */
  @Input() icons?: string[] = [];

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
   * Defines if the send button should be enabled on cards.
   */
  @Input() showSendButton?: boolean = false;

  /**
   * Defines the edit EventEmitter of the cards.
   */
  @Output() edit = new EventEmitter<number>();

  /**
   * Defines the play EventEmitter of the cards.
   */
  @Output() play = new EventEmitter<number>();

  /**
   * Defines delete EventEmitter of the cards.
   */
  @Output() delete = new EventEmitter<number>();

  /**
   * Defines the record EventEmitter of the cards.
   */
  @Output() recordToggle = new EventEmitter<number>();

  /**
   * Defines the send EventEmitter of the cards.
   */
  @Output() send = new EventEmitter<number>();

  /**
   * Defines the alarm EventEmitter of the cards.
   */
  @Output() alarmToggle = new EventEmitter<number>();

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

  /**
   * Defines the recording state of the cards.
   */
  @Input() recording: boolean = false;

  /**
   * Defines the recording complete state of the cards.
   */
  @Input() recordingComplete: boolean = false;

  /**
   * Defines the recording controls state of the cards.
   */
  @Input() showRecordingControls: boolean = false;

  /**
   * Defines the alarm control toggle of the cards.
   */
  @Input() showAlarmToggle: boolean = false;

  /**
   * Defines the alarm state of the cards.
   */
  @Input() isAlarmEnabled: boolean = false;

  /**
   * Defines the music routing state of the cards.
   */
  @Input() isMusicRoutingEnabled: boolean = false;

  /**
   * Defines the onChanges method of the GridCardsComponent.
   * @param changes changes of the grid cards component
   */
  ngOnChanges(changes: SimpleChanges): void {
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
   * @param event of the object
   */
  onEdit(index: number, event: Event): void {
    event.stopPropagation();
    this.edit.emit(index);
  }

  /**
   * Toggles the play state of the card.
   * @param index of the object
   * @param event of the object
   */
  togglePlayStop(index: number, event: Event): void {
    event.stopPropagation();
    this.play.emit(index);
  }

  /**
   * Emits the delete event.
   * @param index of the object
   * @param event of the object
   */
  onDelete(index: number, event: Event): void {
    event.stopPropagation();
    this.delete.emit(index);
  }

  /**
   * Emits the toogle Card event.
   * @param index of the object
   */
  toggleCard(index: number) {
    if (index === 0) {
      this.recordToggle.emit(index);
    }

    if (index === 2) {
      this.alarmToggle.emit(index);
    }
  }

  /**
   * Emits the send event.
   * @param index of the object
   * @param event of the object
   */
  onSend(index: number, event: Event): void {
    event.stopPropagation();
    this.send.emit(index);
  }

  /**
   * Gets the tooltip text of the card.
   * @param index of the object
   * @returns the tooltip text
   */
  getTooltipText(index: number): string {
    if (this.showRecordingControls && index === 0) {
      return 'Aufnahme abspielen';
    } else {
      return this.playing[index]
        ? 'Klingelton anhalten'
        : 'Klingelton abspielen';
    }
  }

  /**
   * Gets the routing link of the card.
   * @param i index of the card
   * @returns the routing link
   */
  getRoutingLink(i: number): string | null {
    if (this.isMusicRoutingEnabled && i === 1) {
      return '/' + RoutingLinks.MusicLink;
    } else if (this.linkArray) {
      return this.linkArray[i];
    } else {
      return null;
    }
  }
}
