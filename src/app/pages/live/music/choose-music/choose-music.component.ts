import {Component, Inject, OnInit} from '@angular/core';
import {ButtonHeight, ButtonValue, ButtonWidths, LiveIcons, StoreService} from "../../../../services/store.service";
import {Song} from "../../../../models/Song";
import {PlaylistSong} from "../../../../models/PlaylistSong";
import {ListboxValueChangeEvent} from "@angular/cdk/listbox";
import {MAT_DIALOG_DATA, MatDialogRef} from "@angular/material/dialog";
import {LiveBackendService} from "../../../../services/live.backend.service";
import {SavePlaylist} from "../../../../models/SavePlaylist";
import {MatSnackBar} from "@angular/material/snack-bar";

/**
 * @author: Thomas Forjan, Philipp Wildzeiss, Martin Kral
 * @version: 0.0.2
 * @since: May 2023
 * @description: Choose-music component
 */
@Component({
  selector: 'app-choose-music',
  templateUrl: './choose-music.component.html',
  styleUrls: ['./choose-music.component.scss']
})
export class ChooseMusicComponent implements OnInit {
  chooseMusicHeroImage: string = LiveIcons.MusicIcon;
  indexAddedSongs = -1;
  existedSongList: string[] = [];
  songList: Song[] = [];

  playlist: PlaylistSong[];
  playlistSelected!: readonly PlaylistSong[];
  songListSelected!: readonly Song[];
  isDeleteBtnDisabled: boolean = true;
  isSlctSongsToPlaylistBtnDisabled: boolean = true;
  isRemoveSlctSongsFromPlaylistBtnDisabled: boolean = true;
  isMoveSelectedSongsUpDownBtnDisabled: boolean = true;
  isSongListChanged: boolean = false;

  protected readonly ButtonValue = ButtonValue;
  protected readonly ButtonWidths = ButtonWidths;
  protected readonly ButtonHeight = ButtonHeight;

  constructor(
    public dialogRef: MatDialogRef<ChooseMusicComponent>,
    private _liveBackendService: LiveBackendService,
    public storeService: StoreService,
    private _snackBar: MatSnackBar,
    @Inject(MAT_DIALOG_DATA)
    public data: {
      playlist: PlaylistSong[];
    }
  ) {
    this.playlist = data.playlist;
    console.log(this.data);
    console.log(this.playlist);
  }

  ngOnInit(): void {
    this._liveBackendService.getSongResponse().subscribe();
    this.storeService.songList$.pipe().subscribe((songList) => {
      this.songList = songList;
      this.sortSongList();
    })
    this.sortPlayList();
  }

  /**
   * Method to move selected songs into the playlist
   */
  moveSelectedSongsItemsToPlaylist() {
    for (const song of this.songListSelected) {
      this.playlist.push({
        id: song.id,
        index: this.playlist.length + 1,
        name: song.name,
        filePath: song.filePath,
        song: song.song,
      });
    }
    this.removeElementsFromSongList()
    this.songListSelected = [];
    this.isDeleteBtnDisabled = true;
  }

  /**
   * Method to move all songs into the playlist.
   */
  moveAllSongsItemsToPlaylist() {
    for (const song of this.songList) {
      this.playlist.push({
        id: song.id,
        index: this.playlist.length + 1,
        name: song.name,
        filePath: song.filePath,
        song: song.song,
      });
    }
    this.songList = [];
  }

  /**
   * Method to delete songs from playlist
   */
  moveSelectedPlaylistSongsItemsToSongList() {
    for (const song of this.playlistSelected) {
      this.songList.push({
        id: song.id,
        name: song.name,
        filePath: song.filePath,
        song: song.song,
      });
    }
    this.removeElemntsFromPlaylistList()
    this.playlistSelected = [];
    this.sortSongList();
  }

  /**
   * Method to delete all songs from the playlist
   */
  moveAllPlaylistSongsItemsToSongList() {
    for (const song of this.playlist) {
      this.songList.push({
        id: song.id,
        name: song.name,
        filePath: song.filePath,
        song: song.song,
      });
    }
    this.playlist = [];
    this.sortSongList();
  }

  /**
   * Method to remove songs from the songList
   */
  removeElementsFromSongList() {
    let tempSongList: Song[] = this.songList;
    this.songList = [];
    for (const song of tempSongList) {
      let songExist = false;
      for (const selectedSong of this.songListSelected) {
        if (song.id === selectedSong.id) {
          songExist = true;
          break;
        }
      }
      if (!songExist) {
        this.songList.push(song);
      }
    }
  }

  /**
   * Method to remove songs from the playlist
   */
  removeElemntsFromPlaylistList() {
    let tempPlaylist = this.playlist;
    this.playlist = [];
    for (const song of tempPlaylist) {
      let songExist = false;
      for (const selectedSong of this.playlistSelected) {
        if (song.id === selectedSong.id) {
          songExist = true;
          break;
        }
      }
      if (!songExist) {
        this.playlist.push(song);
      }
    }
  }


  /**
   * Method to move selected songs in the playlist up (sort)
   */
  moveSelectedSongsUp() {
    let list = this.getTempPlaylistSelectedList();
    list.sort((a, b) => a.index - b.index);
    for (const playlistSong of list) {
      if (playlistSong.index <= 1) {
        break;
      }
      let i = playlistSong.index - 1;
      this.playlist[i].index = this.playlist[i].index - 1;
      this.playlist[i - 1].index = this.playlist[i - 1].index + 1;
      this.sortPlayList();
    }
  }

  /**
   * Method to move selected songs in the playlist down (sort)
   */
  moveSelectedSongsDown() {
    let list = this.getTempPlaylistSelectedList();
    list.sort((a, b) => a.index - b.index);
    list.reverse();
    for (const playlistSong of list) {
      if (list[list.length - 1].index >= this.playlist.length) {
        break;
      }
      let i = playlistSong.index - 1;
      this.playlist[i].index = this.playlist[i].index + 1;
      this.playlist[i + 1].index = this.playlist[i + 1].index - 1;
      this.sortPlayList();
    }
  }

  /**
   * Method to delete selected songs from the songList
   */
  deleteSlctItemsFromSongList() {
    if (this.songListSelected != undefined && this.songListSelected.length > 0) {
      this.removeElementsFromSongList();
      this.songListSelected = [];
    }
    if (this.playlistSelected !== undefined && this.playlistSelected.length > 0) {
      this.removeElemntsFromPlaylistList();
      this.playlistSelected = [];
    }
    this.isDeleteBtnDisabled = true;
    this.isSongListChanged = true;
  }

  /**
   * Method to choose multiple songs
   *
   * @param $event event to select multiple songs
   */
  onSelectSongListItems($event: ListboxValueChangeEvent<Song>) {
    this.songListSelected = $event.value
    if (this.songListSelected.length > 0) {
      this.isDeleteBtnDisabled = false;
      this.isSlctSongsToPlaylistBtnDisabled = false;
    } else {
      this.isDeleteBtnDisabled = true;
      this.isSlctSongsToPlaylistBtnDisabled = true;
    }
  }

  /**
   * Method to choose multiple songs in playlist
   *
   * @param $event event to select multiple songs
   */
  onSelectPlaylistItems($event: ListboxValueChangeEvent<PlaylistSong>) {
    this.playlistSelected = $event.value
    if (this.playlistSelected.length > 0) {
      this.isRemoveSlctSongsFromPlaylistBtnDisabled = false;
      this.isMoveSelectedSongsUpDownBtnDisabled = false;
      this.isDeleteBtnDisabled = false;
    } else {
      this.isRemoveSlctSongsFromPlaylistBtnDisabled = true;
      this.isMoveSelectedSongsUpDownBtnDisabled = true;
      this.isDeleteBtnDisabled = true;
    }
  }


  /**
   * Method which is called when the submit button is clicked
   */
  onSubmitClick() {
    if (this.isSongListChanged) {
      for (const playlistSong of this.playlist) {
        this.songList.push({
          id: playlistSong.id,
          name: playlistSong.name,
          filePath: playlistSong.filePath,
          song: playlistSong.song
        })
      }
    }
    let savePlaylist: SavePlaylist = {
      songListChanged: this.isSongListChanged,
      actualSongList: this.isSongListChanged ? this.songList : [],
      playlistSongDTOList: this.playlist
    }
    this.dialogRef.close(savePlaylist);
  }

  /**
   * Method which is called when the cancel button is clicked
   */
  onCancelClick() {
    this.dialogRef.close();
  }

  /**
   * Method which is called when the upload button is clicked
   */
  onUploadSongs() {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'audio/*';
    input.multiple = true;
    input.onchange = (onChangeEvent: any) => {
      const files = <File[]>onChangeEvent.target.files;
      for (const file of files) {
        if (file && file.type.startsWith('audio/')) {
          if (!this.checkIfSongAlreadyExists(file.name)) {
            let reader = new FileReader();
            let base64data = null;
            reader.readAsDataURL(file.slice(0, file.size, file.type));
            reader.onloadend = function () {
              base64data = reader.result;
              pushSongsToList(file, base64data);
              console.log(base64data);
            }
            let songList = this.songList;
            let indexAddedSongs = this.indexAddedSongs;

            function pushSongsToList(file: File, base64data: string | ArrayBuffer | null) {
              songList.push({
                id: indexAddedSongs,
                filePath: "",
                name: file.name,
                song: base64data
              });
            }

            this.indexAddedSongs -= 1;
            this.isSongListChanged = true;
          } else {
            this.existedSongList.push(file.name);
          }
        } else {
          console.error('Selected file is not an audio file');
        }
      }
      if (this.existedSongList.length > 0) {
        this.showSnackBar();
      }
    };
    input.click();
    this.sortSongList();
  }

  /**
   * Method to check if a song already exists
   *
   * @param fileName name of file
   */
  checkIfSongAlreadyExists(fileName: string) {
    for (const song of this.songList) {
      if (song.name === fileName) {
        return true;
      }
    }
    for (const song of this.playlist) {
      if (song.name === fileName) {
        return true;
      }
    }
    return false;
  }

  /**
   * Method to tell user, that a song already exist
   */
  showSnackBar() {
    let message = this.existedSongList.join(" | ");
    this._snackBar.open(
      `Folgende Lieder wurden nicht hinzugefügt, da es bereits ein Lied mit dem selben Namen gibt: ${message}`,
      'Ok',
      {
        horizontalPosition: 'end',
        verticalPosition: 'bottom',
        duration: 8000,
        panelClass: ['snackbar'],
      }
    );
    this.existedSongList = []
  }

  /**
   * Method to return a list of selected songs
   */
  getTempPlaylistSelectedList() {
    let list: PlaylistSong[] = [];
    for (const playlistSong of this.playlistSelected) {
      list.push(playlistSong);
    }
    return list;
  }

  /**
   * Method to sort songs
   */
  sortSongList() {
    this.songList.sort((a: Song, b: Song) => a.name > b.name ? 1 : -1);
  }

  /**
   * Method to sort songs in the playlist
   */
  sortPlayList() {
    this.playlist.sort((a, b) => a.index - b.index);
  }
}
