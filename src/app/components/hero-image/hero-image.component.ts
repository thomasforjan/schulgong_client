/**
 * @author: Thomas Forjan, Philipp Wildzeiss, Martin Kral
 * @version: 0.0.2
 * @since: April 2023
 * @description: Reusable hero-images component
 */
import {Component, Input} from '@angular/core';

@Component({
  selector: 'app-hero-image',
  templateUrl: './hero-image.component.html',
  styleUrls: ['./hero-image.component.scss'],
})
export class HeroImageComponent {
  /**
   * Defines the image url of the hero image.
   */
  @Input() imageUrl?: string;
}
