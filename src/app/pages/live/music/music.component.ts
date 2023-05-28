import {Component, OnDestroy, OnInit} from '@angular/core';
import {HeroImages, LiveIcons, StoreService} from "../../../services/store.service";
import {Observable,} from "rxjs";
import {PlaylistSong} from "../../../models/PlaylistSong";
import {LiveBackendService} from "../../../services/live.backend.service";
import {MatSliderDragEvent} from "@angular/material/slider";

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
export class MusicComponent implements OnInit, OnDestroy {

  titles = ["Musik auswählen"];
  musicIcons = [LiveIcons.MusicIcon];
  playlistHeroImage: string = HeroImages.RingtonesHeroImage;

  muted: boolean = false;
  unmuted: boolean = true;
  volume$!: Observable<any>;
  acualSongName: string = "Dummy song name";
  checkIfPlaying: boolean = true;
  checkIfStopped: boolean = false;

  constructor(
    public storeService: StoreService,
    private _liveBackendService: LiveBackendService,
  ) {
  }

  ngOnInit(): void {

  }

  ngOnDestroy(): void {

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

  }
}
