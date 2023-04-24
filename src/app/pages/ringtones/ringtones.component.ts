import {Component, OnInit} from '@angular/core';
import {HeroImages, StoreService} from '../../services/store.service';
import {BackendService} from '../../services/backend.service';
import {map, take} from 'rxjs/operators';
import {Ringtone} from '../../models/Ringtone';
import {MatDialog} from '@angular/material/dialog';
import {MatSnackBar} from '@angular/material/snack-bar';
import {Howl} from 'howler';
import {AddEditRingtonesComponent} from "./add-edit-ringtones/add-edit-ringtones.component";
import {DeleteDialogComponent} from "../../components/delete-dialog/delete-dialog.component";

/**
 - author: Thomas Forjan, Philipp Wildzeiss, Martin Kral
 - version: 0.0.1
 - date: 12.04.2023
 - description: Ringtone component
 */
@Component({
  selector: 'app-ringtones', templateUrl: './ringtones.component.html', styleUrls: ['./ringtones.component.scss'],
})
export class RingtonesComponent implements OnInit {
  /**
   * Boolean to check if the user is playing a ringtone
   */
  playing: boolean[] = [];
  /**
   * Boolean to check if the user is adding a ringtone
   */
  isAddRingtone: boolean = true;
  /**
   * Ringtone Hero Image from enum in store service
   */
  ringtoneHeroImage: string = HeroImages.RingtonesHeroImage;
  /**
   * Get the length of the ringtone list
   */
  cardLength$ = this.storeService.ringtoneList$.pipe(map((list) => list.length));
  /**
   * Get the ringtone name from the ringtone list
   */
  ringToneName$ = this.storeService.ringtoneList$.pipe(map((ringtoneList) => ringtoneList.map((ringtone) => ringtone.name)));
  /**
   * Get the ringtone filename from the ringtone list
   */
  ringToneFilename$ = this.storeService.ringtoneList$.pipe(map((ringtoneList) => ringtoneList.map((ringtone) => ringtone.filename)));
  /**
   * Get the ringtone date from the ringtone list
   */
  ringToneDate$ = this.storeService.ringtoneList$.pipe(map((ringTimeList) => ringTimeList.map((ringTone) => {
    const date = new Date(ringTone.date);
    return date.toLocaleDateString('de-DE', {
      day: '2-digit', month: '2-digit', year: 'numeric',
    });
  })));
  /**
   * Get the ringtone size from the ringtone list
   */
  ringToneSize$ = this.storeService.ringtoneList$.pipe(map((ringtoneList) => ringtoneList.map((ringtone) => ringtone.size + ' MB')));
  /**
   * path of fileserver
   */
  private readonly RINGTONEPATH_URL = 'http://192.168.1.239:8887';
  /**
   * Map to store the sound files
   */
  private soundMap: Map<number, Howl> = new Map();
  /**
   * Set to store the updated ringtones
   */
  private updatedRingtones = new Set<number>();

  constructor(public storeService: StoreService, private backendService: BackendService, private dialog: MatDialog, private _snackBar: MatSnackBar) {
  }

  ngOnInit(): void {
    this.getRingtones();
  }

  /**
   * Method which is called when the edit button is clicked
   * @param index index of the ringtone
   */
  onEditRingtone(index: number) {
    const realId = this.getRealId(index);
    if (realId !== undefined) {
      this.storeService.ringtoneList$
        .pipe(take(1))
        .subscribe((ringtoneList) => {
          const ringtoneToEdit = ringtoneList.find((ringtone) => ringtone.id === realId);
          if (ringtoneToEdit) {
            this.ringtoneEditDialog(ringtoneToEdit, index + 1);
          }
        });
    }
  }

  /**
   * Get the ringtones from the backend
   */
  getRingtones() {
    this.backendService
      .getRingtoneResponse()
      .subscribe((ringtoneList: Ringtone[] | null) => {
        if (ringtoneList && ringtoneList.length > 0) {
          this.storeService.updateRingtoneList(ringtoneList);
        }
      });
  }

  /**
   * Method which is called when the delete button is clicked
   * @param index index of the ringtone
   */
  onDeleteRingtone(index: any): void {
    index = this.getRealId(index);

    const dialogRef = this.dialog.open(DeleteDialogComponent, {
      width: '720px',
      height: '500px',
      data: { index: index },
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.backendService.deleteRingtoneResource(index).subscribe(() => {
          this.storeService.ringtoneList$
            .pipe(take(1))
            .subscribe((ringtoneList) => {
              const updateRingtoneList = ringtoneList.filter(
                (ringtone) => ringtone.id !== index
              );
              this.storeService.updateRingtoneList(updateRingtoneList);
            });
        });
      }
    });

    /*this.backendService.deleteRingtoneResource(index).subscribe(() => {
      this.storeService.ringtoneList$
        .pipe(take(1))
        .subscribe((ringtoneList) => {
          const updatedRingtoneList = ringtoneList.filter((ringtone) => ringtone.id !== index);
          this.storeService.updateRingtoneList(updatedRingtoneList);
        });
    });*/
  }

  /**
   * Transform shown number into real id of object
   * @param index of object
   * @returns real id of object
   */
  getRealId(index: number) {
    this.storeService.ringtoneList$.pipe(take(1)).subscribe((ringToneList) => {
      index = ringToneList[index].id;
    });
    return index;
  }

  /**
   * Method which is called when the add button is clicked
   */
  ringtoneAddDialog() {
    const dialogRef = this.dialog.open(AddEditRingtonesComponent, {
      width: '720px', height: '50vh', data: {isAddRingtone: this.isAddRingtone},
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.backendService
          .postRingtoneRequest(result)
          .subscribe((response) => {
            const newRingtone = response.body;
            if (newRingtone) {
              this.storeService.ringtoneList$
                .pipe(take(1))
                .subscribe((currentRingtoneList) => {
                  const updatedList = [...currentRingtoneList, newRingtone];
                  this.storeService.updateRingtoneList(updatedList);
                });

              this._snackBar.open('Klingelton wird hinzugefügt', 'Ok', {
                horizontalPosition: 'end', verticalPosition: 'bottom', duration: 2000,
              });
            }
          });
      }
    });
  }

  /**
   * Method which is called when the edit button is clicked
   * @param ringtone ringtone to edit
   */
  ringtoneEditDialog(ringtone: Ringtone, index: number) {
    const dialogRef = this.dialog.open(AddEditRingtonesComponent, {
      width: '720px', height: '50vh', data: {isAddRingtone: false, ringtone, index},
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        const formData = new FormData();
        formData.append('name', result.get('name'));

        if (result.get('song')) {
          formData.append('song', result.get('song'));
        }

        const updateRequest = this.backendService.updateRingtoneResource(formData, ringtone.id);

        updateRequest.subscribe((response) => {
          const updatedRingtone = response.body;
          if (updatedRingtone) {
            this.storeService.ringtoneList$
              .pipe(take(1))
              .subscribe((result) => {
                const updatedList = result.map((ringtone) => ringtone.id === updatedRingtone.id ? updatedRingtone : ringtone);
                this.storeService.updateRingtoneList(updatedList);
              });

            // Add the updated ringtone ID to the updatedRingtones set
            this.updatedRingtones.add(updatedRingtone.id);

            this._snackBar.open('Klingelton wurde aktualisiert', 'Ok', {
              horizontalPosition: 'end', verticalPosition: 'bottom', duration: 2000,
            });
          }
        });
      }
    });
  }

  /**
   * Tool to toggle the play/pause state of a ringtone
   * @param index index of the ringtone
   */
  togglePlayPause(index: number): void {
    this.playing[index] = !this.playing[index];

    if (this.playing[index]) {
      this.storeService.ringtoneList$
        .pipe(take(1))
        .subscribe((ringtoneList) => {
          const ringtone = ringtoneList[index];
          const ringtonePath = `${this.RINGTONEPATH_URL}/${ringtone.filename}`;

          let sound = this.soundMap.get(ringtone.id);

          if (!sound || this.updatedRingtones.has(ringtone.id)) {
            // Unload and remove the previous sound, if it exists
            if (sound) {
              sound.unload();
              this.soundMap.delete(ringtone.id);
            }

            // Create a new sound for the ringtone
            sound = new Howl({
              src: [ringtonePath], onloaderror: (soundId, error) => {
                console.error('Howler Load Error:', error);
              },
            });

            this.soundMap.set(ringtone.id, sound);

            // Remove the ringtone ID from the updatedRingtones set
            this.updatedRingtones.delete(ringtone.id);
          }

          sound.play();

          sound.once('end', () => {
            this.playing[index] = false;
          });
        });
    } else {
      const sound = this.soundMap.get(this.getRealId(index));
      if (sound) {
        sound.stop();
      }
    }
  }
}
