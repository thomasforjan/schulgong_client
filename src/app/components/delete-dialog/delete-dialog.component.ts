import { Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { BackendService } from 'src/app/services/backend.service';
import { HeroImages, StoreService } from 'src/app/services/store.service';

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
    public storeService: StoreService,
    public backendService: BackendService,
    public dialogRef: MatDialogRef<DeleteDialogComponent>,
    @Inject(MAT_DIALOG_DATA)
    public data: { deleteItem?: Object; index?: number }
  ) {}

  ngOnInit(): void {}

  onSubmitClick() {
    this.dialogRef.close(this.data);
  }

  onCancelClick() {
    this.dialogRef.close();
  }
}
