import {Component, OnDestroy, OnInit} from '@angular/core';
import {HeroImages, StoreService} from '../../services/store.service';
import {map, take} from 'rxjs/operators';
import {Ringtone} from '../../models/Ringtone';
import {MatDialog} from '@angular/material/dialog';
import {MatSnackBar} from '@angular/material/snack-bar';
import {Howl} from 'howler';
import {AddEditRingtonesComponent} from './add-edit-ringtones/add-edit-ringtones.component';
import {DeleteDialogComponent} from '../../components/delete-dialog/delete-dialog.component';
import {DateUtilsService} from 'src/app/services/date-utils.service';
import {UtilsService} from "../../services/utils.service";
import {RingtoneBackendService} from "../../services/ringtone.backend.service";

/**
 * @author: Thomas Forjan, Philipp Wildzeiss, Martin Kral
 * @version: 0.0.2
 * @since: April 2023
 * @description: Ringtone component
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
  ringtoneName$ = this.storeService.ringtoneList$.pipe(
    map((ringtoneList) => ringtoneList.map((ringtone) => ringtone.name))
  );
  /**
   * Get the ringtone filename from the ringtone list
   */
  ringtoneFilename$ = this.storeService.ringtoneList$.pipe(
    map((ringtoneList) => ringtoneList.map((ringtone) => ringtone.filename))
  );
  /**
   * Get the ringtone date from the ringtone list
   */
  ringtoneDate$ = this.storeService.ringtoneList$.pipe(
    map((ringtimeList) =>
      ringtimeList.map((ringtone) => {
        return this._dateUtilsService.convertDateTimeToString(new Date(ringtone.date), 'de-DE');
      })
    )
  );
  /**
   * Get the ringtone size from the ringtone list
   */
  ringtoneSize$ = this.storeService.ringtoneList$.pipe(
    map((ringtoneList) => ringtoneList.map((ringtone) => ringtone.size + ' MB'))
  );
  /**
   * path of fileserver
   */
  private readonly _RINGTONEPATH_URL = 'http://192.168.1.8:8887';
  /**
   * Map to store the sound files
   */
  private _soundMap: Map<number, Howl> = new Map();
  /**
   * Set to store the updated ringtones
   */
  private _updatedRingtones = new Set<number>();

  constructor(
    public storeService: StoreService,
    private _ringtoneBackendService: RingtoneBackendService,
    private _dateUtilsService: DateUtilsService,
    private _dialog: MatDialog,
    private _utilsService: UtilsService,
    private _snackBar: MatSnackBar
  ) {
  }

  /**
   * Lifecycle Hook which is called when the component is initialized
   */
  ngOnInit(): void {
    /**
     * Get the ringtones from the backend service
     */
    this._ringtoneBackendService.getRingtoneResponse().subscribe();
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
    const realId = this._utilsService.getRealObjectId(index, this.storeService.ringtoneList$);
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
   * Method which is called when the delete button is clicked
   * @param index index of the ringtone
   */
  onDeleteRingtone(index: any): void {
    index = this._utilsService.getRealObjectId(index, this.storeService.ringtoneList$);

    const dialogRef = this._dialog.open(DeleteDialogComponent, {
      width: '720px',
      height: '500px',
      data: {index: index},
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this._ringtoneBackendService.deleteRingtoneResource(index).subscribe({
          next: () => {
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
          error: () => {
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
        });
      }
    });
  }

  /**
   * Method which is called when the add button is clicked
   */
  ringtoneAddDialog() {
    const dialogRef = this._dialog.open(AddEditRingtonesComponent, {
      width: '720px',
      height: '600px',
      data: {isAddRingtone: this.isAddRingtone},
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this._ringtoneBackendService
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
   * @param index of ringtone object
   */
  ringtoneEditDialog(ringtone: Ringtone, index: number) {
    const dialogRef = this._dialog.open(AddEditRingtonesComponent, {
      width: '720px',
      height: '600px',
      data: {isAddRingtone: false, ringtone, index},
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        const formData = new FormData();
        formData.append('name', result.get('name'));

        if (result.get('song')) {
          formData.append('song', result.get('song'));
        }

        const updateRequest = this._ringtoneBackendService.updateRingtoneResource(
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
            this._updatedRingtones.add(updatedRingtone.id);

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
   * Tool to toggle the play/stop state of a ringtone
   * @param index index of the ringtone
   */
  togglePlayStop(index: number): void {
    // If another ringtone is playing, stop it
    if (
      this.currentlyPlayingIndex !== null &&
      this.currentlyPlayingIndex !== index
    ) {
      // Reset the playing state and stop and remove the sound of the deleted ringtone
      this.stopAndResetRingtone(this._utilsService.getRealObjectId(this.currentlyPlayingIndex, this.storeService.ringtoneList$));
    }

    this.playing[index] = !this.playing[index];

    if (this.playing[index]) {
      this.currentlyPlayingIndex = index; // Set the currently playing index
      this.storeService.ringtoneList$
        .pipe(take(1))
        .subscribe((ringtoneList) => {
          const ringtone = ringtoneList[index];

          let sound = this._soundMap.get(ringtone.id);

          if (!sound || this._updatedRingtones.has(ringtone.id)) {
            // Unload and remove the previous sound, if it exists
            if (sound) {
              sound.unload();
              this._soundMap.delete(ringtone.id);
            }

            // Fetch the ringtone Blob from the backend
            this._ringtoneBackendService.getMusicFile(ringtone.id).subscribe((blob) => {
              if (blob) {
                // Create a new sound for the ringtone
                const blobUrl = URL.createObjectURL(blob);
                sound = new Howl({
                  src: [blobUrl],
                  format: ['mp3'],
                  onloaderror: (soundId, error) => {
                    console.error('Howler Load Error:', error);
                  },
                });

                this._soundMap.set(ringtone.id, sound);

                // Remove the ringtone ID from the updatedRingtones set
                this._updatedRingtones.delete(ringtone.id);

                // Play the sound
                sound.play();

                // Handle the end event
                sound.once('end', () => {
                  this.playing[index] = false;
                });
              }
            });
          } else {
            // If sound exists, just play it
            sound.play();

            sound.once('end', () => {
              this.playing[index] = false;
            });
          }
        });
    } else {
      this.currentlyPlayingIndex = null; // Set the index to null, if the ringtone will be stopped
      const sound = this._soundMap.get(this._utilsService.getRealObjectId(index, this.storeService.ringtoneList$));
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
      this._utilsService.getRealObjectId(this.currentlyPlayingIndex, this.storeService.ringtoneList$) === ringtoneId
    ) {
      this.playing[this.currentlyPlayingIndex] = false;
      this.currentlyPlayingIndex = null;
    }

    // Retrieve the Howl sound object from the soundMap using the ringtoneId.
    const sound = this._soundMap.get(ringtoneId);

    // If a sound object exists for the given ringtoneId, stop it, unload it, and remove it from the soundMap.
    if (sound) {
      sound.stop();
      sound.unload();
      this._soundMap.delete(ringtoneId);
    }
  }

  /**
   * Stops and unloads all sounds stored in the soundMap.
   */
  stopAllSounds(): void {
    this._soundMap.forEach((sound) => {
      sound.stop();
      sound.unload();
    });
    this._soundMap.clear();
  }
}
