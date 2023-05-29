import {Component, OnInit} from '@angular/core';
import {HeroImages, LiveIcons, StoreService} from "../../../services/store.service";
import {Observable,} from "rxjs";
import {PlaylistSong} from "../../../models/PlaylistSong";
import {LiveBackendService} from "../../../services/live.backend.service";
import {MatSliderDragEvent} from "@angular/material/slider";
import {MatDialog} from "@angular/material/dialog";
import {ChooseMusicComponent} from "./choose-music/choose-music.component";
import {SavePlaylist} from "../../../models/SavePlaylist";
import {map, take} from "rxjs/operators";
import {Playlist} from "../../../models/Playlist";

/**
 * @author: Thomas Forjan, Philipp Wildzeiss, Martin Kral
 * @version: 0.0.1
 * @since: May 2023
 * @description: Music component
 */
@Component({
  selector: 'app-music',
  templateUrl: './music.component.html',
  styleUrls: ['./music.component.scss'],
})
export class MusicComponent implements OnInit {

  titles = ["Musik auswählen"];
  musicIcons = [LiveIcons.MusicIcon];
  playlistHeroImage: string = HeroImages.RingtonesHeroImage;

  muted: boolean = false;
  unmuted: boolean = true;
  volume$!: Observable<any>;
  acualSongName: string = "Dummy song name";
  checkIfPlaying: boolean = true;
  checkIfStopped: boolean = false;
  songDTOList$ = this.storeService.playlist$.pipe(map((playlist) => playlist.songDTOList));
  acualSongName$ = this.storeService.playlist$.pipe(map((playlist) => playlist.actualSong.name));

  constructor(
    public storeService: StoreService,
    private _liveBackendService: LiveBackendService,
    private _dialog: MatDialog,
  ) {
  }

  ngOnInit(): void {
    this.getPlaylist();
  }

  /**
   * Method for start playing the playlist
   */
  playPlaylist() {
    this.checkIfPlaying = !this.checkIfPlaying;
    this.checkIfStopped = !this.checkIfStopped;
  }

  /**
   * Method for stop playing the playlist
   */
  stopPlaylist() {
    this.checkIfPlaying = !this.checkIfPlaying;
    this.checkIfStopped = !this.checkIfStopped;
  }

  /**
   * Method for switch to the previous song
   */
  playPreviousSong() {

  }

  /**
   * Method for switch to the next song
   */
  playNextSong() {

  }

  /**
   * Method for mute and unmute
   */
  setMute() {
    this.muted = !this.muted;
    this.unmuted = !this.unmuted;
  }

  /**
   * Method for set the volume
   */
  onVolumeChange($event: MatSliderDragEvent) {

  }

  /**
   * Method for open the config playlist dialog
   */
  onClickMusicCard(index: number) {
    let playlist: PlaylistSong[] = [];
    this.songDTOList$.pipe().subscribe((songList) => {
      for (const playlistSong of songList) {
        playlist.push(playlistSong);
      }
    });
    const dialogRef = this._dialog.open(ChooseMusicComponent, {
      width: '720px',
      height: '65vh',
      data: {playlist: playlist}
    });
    dialogRef.afterClosed().subscribe((result: SavePlaylist) => {
      if (result) {
        this.storeService.playlist$.pipe(take(1)).subscribe((playlist) => {
          playlist.songDTOList = result.playlistSongDTOList;
          playlist.actualSong = result.playlistSongDTOList[0];
        });
        this.acualSongName$ = this.storeService.playlist$.pipe(map((playlist) => playlist.actualSong.name));
        this._liveBackendService.postSavePlaylist(result);
      }
    });
  }

  /**
   * Get the playlist from the backend
   */
  getPlaylist() {
    return this._liveBackendService
      .getPlaylist()
      .subscribe((playlist: Playlist | null) => {
        if (playlist) {
          return this.storeService.updatePlaylist(playlist);
        }
      });


  }
}
