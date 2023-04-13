/**
 * author: Thomas Forjan, Philipp Wildzeiss, Martin Kral
 * version: 0.0.1
 * date: 31/03/2023
 * description: info bar component
 */

import { Component } from '@angular/core';
import { Observable, interval, map } from 'rxjs';

@Component({
  selector: 'app-info-bar',
  templateUrl: './info-bar.component.html',
  styleUrls: ['./info-bar.component.scss'],
})
export class InfoBarComponent {
  /**
   * Defines the current date.
   */
  currentDate$: Observable<string> = interval(1000).pipe(
    map(() => {
      const date = new Date();
      return date.toLocaleDateString('de-DE', {
        day: '2-digit',
        month: 'long',
        year: 'numeric',
      });
    })
  );

  /**
   * Defines the current time.
   */
  currentTime$: Observable<string> = interval(1000).pipe(
    map(() => new Date().toLocaleTimeString())
  );
}
