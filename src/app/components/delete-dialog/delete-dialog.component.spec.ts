import {ComponentFixture, TestBed} from '@angular/core/testing';

import {DeleteDialogComponent} from './delete-dialog.component';
import {HeroImageComponent} from "../hero-image/hero-image.component";
import {ButtonComponent} from "../button/button.component";
import {MatTooltipModule} from "@angular/material/tooltip";
import {MatIconModule} from "@angular/material/icon";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";

/**
 * @author: Thomas Forjan, Philipp Wildzeiss, Martin Kral
 * @version: 0.0.2
 * @since: April 2023
 * @description: Tests for reusable delete dialog
 */
describe('DeleteDialogComponent', () => {
  let component: DeleteDialogComponent;
  let fixture: ComponentFixture<DeleteDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [DeleteDialogComponent, HeroImageComponent, ButtonComponent ],
      imports: [MatTooltipModule, MatIconModule],
      providers: [{provide: MatDialogRef, useValue: {}}, {provide: MAT_DIALOG_DATA, useValue: {}}]
    })
      .compileComponents();

    fixture = TestBed.createComponent(DeleteDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
