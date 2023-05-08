import { Component, OnDestroy, OnInit } from '@angular/core';
import { HeroImages, StoreService } from '../../services/store.service';
import { BackendService } from '../../services/backend.service';
import { map, take } from 'rxjs/operators';
import { Ringtone } from '../../models/Ringtone';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Howl } from 'howler';
import { AddEditRingtonesComponent } from './add-edit-ringtones/add-edit-ringtones.component';
import { DeleteDialogComponent } from '../../components/delete-dialog/delete-dialog.component';

/**
 - author: Thomas Forjan, Philipp Wildzeiss, Martin Kral
 - version: 0.0.2
 - date: 06.05.2023
 - description: Ringtone component
 */
@Component({
  selector: 'app-ringtones',
  templateUrl: './ringtones.component.html',
  styleUrls: ['./ringtones.component.scss'],
})
export class RingtonesComponent implements OnInit, OnDestroy {
  /**
   * Boolean to check if the user is playing a ringtone
   */
  playing: boolean[] = [];

  /**
   * Index of the currently playing ringtone
   */
  currentlyPlayingIndex: number | null = null;

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
  cardLength$ = this.storeService.ringtoneList$.pipe(
    map((list) => list.length)
  );

  /**
   * Get the ringtone name from the ringtone list
   */
  ringToneName$ = this.storeService.ringtoneList$.pipe(
    map((ringtoneList) => ringtoneList.map((ringtone) => ringtone.name))
  );

  /**
   * Get the ringtone filename from the ringtone list
   */
  ringToneFilename$ = this.storeService.ringtoneList$.pipe(
    map((ringtoneList) => ringtoneList.map((ringtone) => ringtone.filename))
  );

  /**
   * Get the ringtone date from the ringtone list
   */
  ringToneDate$ = this.storeService.ringtoneList$.pipe(
    map((ringTimeList) =>
      ringTimeList.map((ringTone) => {
        const date = new Date(ringTone.date);
        return date.toLocaleDateString('de-DE', {
          day: '2-digit',
          month: '2-digit',
          year: 'numeric',
        });
      })
    )
  );

  /**
   * Get the ringtone size from the ringtone list
   */
  ringToneSize$ = this.storeService.ringtoneList$.pipe(
    map((ringtoneList) => ringtoneList.map((ringtone) => ringtone.size + ' MB'))
  );

  /**
   * path of fileserver
   */
  private readonly RINGTONEPATH_URL = 'http://192.168.171.1:8887';

  /**
   * Map to store the sound files
   */
  private soundMap: Map<number, Howl> = new Map();

  /**
   * Set to store the updated ringtones
   */
  private updatedRingtones = new Set<number>();

  constructor(
    public storeService: StoreService,
    private backendService: BackendService,
    private dialog: MatDialog,
    private _snackBar: MatSnackBar
  ) {}

  /**
   * Lifecycle Hook which is called when the component is initialized
   */
  ngOnInit(): void {
    this.getRingtones();
  }

  /**
   * Lifecycle Hook which is called when the component is destroyed
   */
  ngOnDestroy(): void {
    this.stopAllSounds();
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
          const ringtoneToEdit = ringtoneList.find(
            (ringtone) => ringtone.id === realId
          );
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
        this.backendService.deleteRingtoneResource(index).subscribe(
          () => {
            this.storeService.ringtoneList$
              .pipe(take(1))
              .subscribe((ringtoneList) => {
                const updateRingtoneList = ringtoneList.filter(
                  (ringtone) => ringtone.id !== index
                );
                this.storeService.updateRingtoneList(updateRingtoneList);
              });

            // Reset the playing state and stop and remove the sound of the deleted ringtone
            this.stopAndResetRingtone(index);

            this._snackBar.open('Klingelton erfolgreich gelöscht!', 'Ok', {
              horizontalPosition: 'end',
              verticalPosition: 'bottom',
              duration: 2000,
            });
          },
          (error) => {
            this._snackBar.open(
              'Klingelton konnte nicht gelöscht werden (Info: möglicherweise wird der Klingelton für eine Klingelzeit verwendet).',
              'Ok',
              {
                horizontalPosition: 'end',
                verticalPosition: 'bottom',
                duration: 4000,
              }
            );
          }
        );
      }
    });
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
      width: '720px',
      height: '600px',
      data: { isAddRingtone: this.isAddRingtone },
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
                horizontalPosition: 'end',
                verticalPosition: 'bottom',
                duration: 2000,
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
      width: '720px',
      height: '600px',
      data: { isAddRingtone: false, ringtone, index },
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        const formData = new FormData();
        formData.append('name', result.get('name'));

        if (result.get('song')) {
          formData.append('song', result.get('song'));
        }

        const updateRequest = this.backendService.updateRingtoneResource(
          formData,
          ringtone.id
        );

        updateRequest.subscribe((response) => {
          const updatedRingtone = response.body;
          if (updatedRingtone) {
            this.storeService.ringtoneList$
              .pipe(take(1))
              .subscribe((result) => {
                const updatedList = result.map((ringtone) =>
                  ringtone.id === updatedRingtone.id
                    ? updatedRingtone
                    : ringtone
                );
                this.storeService.updateRingtoneList(updatedList);
              });

            // Add the updated ringtone ID to the updatedRingtones set
            this.updatedRingtones.add(updatedRingtone.id);

            // Reset the playing state and stop and remove the sound of the deleted ringtone
            this.stopAndResetRingtone(updatedRingtone.id);

            this._snackBar.open('Klingelton wurde aktualisiert', 'Ok', {
              horizontalPosition: 'end',
              verticalPosition: 'bottom',
              duration: 2000,
            });
          }
        });
      }
    });
  }

  /**
   * Toggle the play/stop state of a ringtone
   * @param index index of the ringtone
   */
  togglePlayStop(index: number): void {
    // If another ringtone is playing, stop it
    if (
      this.currentlyPlayingIndex !== null &&
      this.currentlyPlayingIndex !== index
    ) {
      // Reset the playing state and stop and remove the sound of the deleted ringtone
      this.stopAndResetRingtone(this.getRealId(this.currentlyPlayingIndex));
    }

    this.playing[index] = !this.playing[index];

    if (this.playing[index]) {
      this.currentlyPlayingIndex = index; // Set the currently playing index
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
              src: [ringtonePath],
              onloaderror: (soundId, error) => {
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
      this.currentlyPlayingIndex = null; // Set the index to null, if the ringtone will be stopped
      const sound = this.soundMap.get(this.getRealId(index));
      if (sound) {
        sound.stop();
      }
    }
  }

  /**
   * Stops, unloads, and resets the playing state of a given ringtone.
   * @param ringtoneId The ID of the ringtone to stop and reset.
   */
  stopAndResetRingtone(ringtoneId: number): void {
    // If the provided ringtoneId is currently playing, reset its playing state and set the currentlyPlayingIndex to null.
    if (
      this.currentlyPlayingIndex !== null &&
      this.getRealId(this.currentlyPlayingIndex) === ringtoneId
    ) {
      this.playing[this.currentlyPlayingIndex] = false;
      this.currentlyPlayingIndex = null;
    }

    // Retrieve the Howl sound object from the soundMap using the ringtoneId.
    const sound = this.soundMap.get(ringtoneId);

    // If a sound object exists for the given ringtoneId, stop it, unload it, and remove it from the soundMap.
    if (sound) {
      sound.stop();
      sound.unload();
      this.soundMap.delete(ringtoneId);
    }
  }

  /**
   * Stops and unloads all sounds stored in the soundMap.
   */
  stopAllSounds(): void {
    this.soundMap.forEach((sound) => {
      sound.stop();
      sound.unload();
    });
    this.soundMap.clear();
  }
}
