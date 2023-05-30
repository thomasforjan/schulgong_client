import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeleteDialogComponent } from './delete-dialog.component';
import { HeroImageComponent } from '../hero-image/hero-image.component';
import { ButtonComponent } from '../button/button.component';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatIconModule } from '@angular/material/icon';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

/**
 * @author: Thomas Forjan, Philipp Wildzeiss, Martin Kral
 * @version: 0.0.3
 * @since: April 2023
 * @description: Tests for reusable delete dialog
 */

/**
 * @description
 * Suite of tests for the DeleteDialogComponent
 */
describe('DeleteDialogComponent', () => {
  let component: DeleteDialogComponent;
  let fixture: ComponentFixture<DeleteDialogComponent>;
  let mockDialogRef: jasmine.SpyObj<MatDialogRef<DeleteDialogComponent>>;

  /**
   * @description
   * Set up the test bed with the necessary modules, providers and component declarations.
   * Create a spy object for MatDialogRef with a `close` method.
   */
  beforeEach(async () => {
    mockDialogRef = jasmine.createSpyObj('MatDialogRef', ['close']);
    await TestBed.configureTestingModule({
      declarations: [
        DeleteDialogComponent,
        HeroImageComponent,
        ButtonComponent,
      ],
      imports: [MatTooltipModule, MatIconModule],
      providers: [
        { provide: MatDialogRef, useValue: mockDialogRef },
        { provide: MAT_DIALOG_DATA, useValue: { deleteItem: {}, index: 0 } },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(DeleteDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  /**
   * @description
   * Test to check if the component is created correctly.
   */
  it('should create', () => {
    expect(component).toBeTruthy();
  });

  /**
   * @description
   * Test to check if the `onCancelClick` method closes the dialog without any data.
   */
  it('should close dialog with no data on cancel', () => {
    component.onCancelClick();
    expect(mockDialogRef.close).toHaveBeenCalledTimes(1);
    expect(mockDialogRef.close).toHaveBeenCalledWith();
  });

  /**
   * @description
   * Test to check if the `onSubmitClick` method closes the dialog with the provided data.
   */
  it('should close dialog with data on submit', () => {
    component.onSubmitClick();
    expect(mockDialogRef.close).toHaveBeenCalledTimes(1);
    expect(mockDialogRef.close).toHaveBeenCalledWith(component.data);
  });
});
