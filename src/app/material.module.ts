/**
- author: Thomas Forjan, Philipp Wildzeiss, Martin Kral
- version: 0.0.1
- date: 31.03.2023
- description: Material module
*/

import { NgModule } from '@angular/core';

import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatMenuModule } from '@angular/material/menu';

/**
 * Angular Material components
 */
const material = [
  MatToolbarModule,
  MatIconModule,
  MatCardModule,
  MatButtonModule,
  MatTooltipModule,
  MatMenuModule,
];

@NgModule({
  imports: [...material],
  exports: [material],
})
export class MaterialModule {}
