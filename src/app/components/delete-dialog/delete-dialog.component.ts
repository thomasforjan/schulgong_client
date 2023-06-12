import {Component, Inject} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {ButtonValue, ButtonWidths, HeroImages} from 'src/app/services/store.service';

/**
 * @author: Thomas Forjan, Philipp Wildzeiss, Martin Kral
 * @version: 0.0.2
 * @since: April 2023
 * @description: Reusable delete dialog component
 */
@Component({
  selector: 'app-delete-dialog',
  templateUrl: './delete-dialog.component.html',
  styleUrls: ['./delete-dialog.component.scss'],
})
export class DeleteDialogComponent {
  /**
   Delete Hero Image, enum is in store service
   */
  deleteHeroImage: string = HeroImages.DeleteHeroImage;
  titleText: string;

  protected readonly ButtonValue = ButtonValue;
  protected readonly ButtonWidths = ButtonWidths;

  constructor(
    public dialogRef: MatDialogRef<DeleteDialogComponent>,
    @Inject(MAT_DIALOG_DATA)
    public data: { deleteItem?: Object; index?: number; titleText?: string }
  ) {
    if (data.titleText != undefined && data.titleText.length > 0) {
      this.titleText = data.titleText;
    } else {
      this.titleText = "Möchten Sie den Eintrag";
    }
  }

  /**
   * Method which is called when the submit button is clicked
   */
  onSubmitClick() {
    this.dialogRef.close(this.data);
  }

  /**
   * Method which is called when the cancel button is clicked
   */
  onCancelClick() {
    this.dialogRef.close();
  }
}
