import {Component, Inject} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material/dialog';
import {HeroImages} from 'src/app/services/store.service';

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

  constructor(
    public dialogRef: MatDialogRef<DeleteDialogComponent>,
    @Inject(MAT_DIALOG_DATA)
    public data: { deleteItem?: Object; index?: number }
  ) {
  }

  ngOnInit(): void {
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
