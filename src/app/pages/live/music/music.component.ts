import {Component, OnDestroy, OnInit} from '@angular/core';
import {HeroImages, LiveIcons, StoreService} from "../../../services/store.service";
import {Subject, Subscription, switchMap, takeUntil, timer,} from "rxjs";
import {PlaylistSong} from "../../../models/PlaylistSong";
import {LiveBackendService} from "../../../services/live.backend.service";
import {MatSliderDragEvent} from "@angular/material/slider";
import {MatDialog} from "@angular/material/dialog";
import {ChooseMusicComponent} from "./choose-music/choose-music.component";
import {SavePlaylist} from "../../../models/SavePlaylist";
import {map, take} from "rxjs/operators";
import {SpeakerState} from "../../../models/Playlist";

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

  timeInterval!: Subscription;

  speakerState$ = this.storeService.playlist$.pipe(map((playlist) => playlist.speakerState));
  muted$ = this.storeService.playlist$.pipe(map((playlist) => playlist.mute));
  unmuted$ = this.storeService.playlist$.pipe(map((playlist) => !playlist.mute));
  volume$ = this.storeService.playlist$.pipe(map((playlist) => playlist.volume));
  checkIfPlaying$ = this.speakerState$.pipe(map((speakerState) => {
    return speakerState !== SpeakerState.PLAYING
  }));
  checkIfStopped$ = this.speakerState$.pipe(map((playlist) => {
    return playlist === SpeakerState.PLAYING
  }));
  songDTOList$ = this.storeService.playlist$.pipe(map((playlist) => {
    if(playlist) {
      return playlist.songDTOList;
    }else {
      return [];
    }
  }))
  acualSongName$ = this.storeService.playlist$.pipe(map((playlist) => playlist.actualSong.name));

  closeTimer$ = new Subject<any>();
  interaction = false;
  constructor(
    public storeService: StoreService,
    private _liveBackendService: LiveBackendService,
    private _dialog: MatDialog,
  ) {
  }

  ngOnInit(): void {
    if(!this.storeService.isAlarmEnabled) {
      this.startPoll();
    }
  }

  ngOnDestroy(): void {
    if(this.timeInterval !== undefined && !this.timeInterval.closed) {
      this.timeInterval.unsubscribe();
    }
  }

  /**
   * Method for start the poll to check in a specific intervall the speaker state
   */
  startPoll() {
    this.timeInterval = timer(0, 2000).pipe(
      switchMap(() => this._liveBackendService.getPlaylist()),
      takeUntil(this.closeTimer$)).subscribe((playlist) => {
        console.log("TIMER")
        if (!this.interaction) {
          this.storeService.updatePlaylist(playlist);
        }
      }
    )
  }

  /**
   * Method for to stop the poll
   */
  stopPoll() {
    if (this.timeInterval !== undefined && !this.timeInterval.closed) {
      this.timeInterval.unsubscribe();
    }
  }

  /**
   * Start the poll again after a playlist action
   */
  async startPollAfterAction() {
    await new Promise(f => setTimeout(f, 2000));
    if (this.timeInterval.closed) {
      this.startPoll();
    }
  }

  /**
   * Method for start playing the playlist
   */
  async playPlaylist() {
    this.stopPoll();
    this.storeService.playlist$.pipe(take(1)).subscribe((playlist) => {
      playlist.speakerState = SpeakerState.PLAYING.valueOf();
    });
    this.storeService.playlist$.pipe(take(1)).subscribe();

    this.checkIfPlaying$ = this.speakerState$.pipe(map((speakerState) => {
      return speakerState !== SpeakerState.PLAYING
    }))

    this.checkIfStopped$ = this.speakerState$.pipe(map((playlist) => {
      return playlist === SpeakerState.PLAYING
    }))

    let speakerCommand;
    speakerCommand = {
      command: "PLAY",
      parameter: ""
    }

    this._liveBackendService.postPlaylistCommands(speakerCommand);
    await this.startPollAfterAction();
  }

  /**
   * Method for stop playing the playlist
   */
  async stopPlaylist() {
    this.stopPoll();
    this.storeService.playlist$.pipe(take(1)).subscribe((playlist) => {
      playlist.speakerState = SpeakerState.PAUSED_PLAYBACK.valueOf();
    });
    this.storeService.playlist$.pipe(take(1)).subscribe();

    this.checkIfPlaying$ = this.speakerState$.pipe(map((speakerState) => {
      return speakerState !== SpeakerState.PLAYING
    }))

    this.checkIfStopped$ = this.speakerState$.pipe(map((playlist) => {
      return playlist === SpeakerState.PLAYING
    }))

    let speakerCommand = {
      command: "STOP",
      parameter: ""
    }
    this._liveBackendService.postPlaylistCommands(speakerCommand);
    await this.startPollAfterAction();
  }

  /**
   * Method for switch to the previous song
   */
  async playPreviousSong() {
    this.stopPoll();
    this.storeService.playlist$.pipe(take(1)).subscribe((playlist) => {
      console.log(playlist.actualSong.index)
      console.log(playlist.songDTOList.length)
      console.log(playlist.actualSong.name)
      if (playlist.actualSong.index === 1) {
        console.log("IN IF")
        playlist.actualSong = playlist.songDTOList[playlist.songDTOList.length - 1]
      } else {
        console.log("IN ELSE")
        console.log(playlist.actualSong.index)
        playlist.actualSong = playlist.songDTOList[playlist.actualSong.index - 2]
      }
    });
    this.acualSongName$ = this.storeService.playlist$.pipe(map((playlist) => playlist.actualSong.name))
    let speakerCommand = {
      command: "PREVIOUS",
      parameter: ""
    }
    this._liveBackendService.postPlaylistCommands(speakerCommand);
    await this.startPollAfterAction();
  }

  /**
   * Method for switch to the next song
   */
  async playNextSong() {
    this.stopPoll();
    this.storeService.playlist$.pipe(take(1)).subscribe((playlist) => {
      if (playlist.actualSong.index === playlist.songDTOList.length) {
        playlist.actualSong = playlist.songDTOList[0]
      } else {
        playlist.actualSong = playlist.songDTOList[playlist.actualSong.index]
      }
    });
    this.acualSongName$ = this.storeService.playlist$.pipe(map((playlist) => playlist.actualSong.name))
    let speakerCommand = {
      command: "NEXT",
      parameter: ""
    }
    this._liveBackendService.postPlaylistCommands(speakerCommand);
    await this.startPollAfterAction();
  }

  /**
   * Method for mute and unmute
   */
  async setMute() {
    this.stopPoll();
    let mute = false;
    this.storeService.playlist$.pipe(take(1)).subscribe((playlist) => {
      playlist.mute = !playlist.mute;
      mute = playlist.mute;
    });
    this.muted$ = this.storeService.playlist$.pipe(map((playlist) => playlist.mute));
    this.unmuted$ = this.storeService.playlist$.pipe(map((playlist) => !playlist.mute));
    let speakerCommand = {
      command: "MUTE",
      parameter: String(mute)
    }
    this._liveBackendService.postPlaylistCommands(speakerCommand);
    await this.startPollAfterAction();
  }

  /**
   * Method for set the volume
   */
  async onVolumeChange(event: MatSliderDragEvent) {
    this.stopPoll();
    let speakerCommand = {
      command: "VOLUME",
      parameter: String(event.value),
    }
    this._liveBackendService.postPlaylistCommands(speakerCommand);
    await this.startPollAfterAction();
  }

  /**
   * Method for open the config playlist dialog
   */
  onClickMusicCard(index: number) {
    this.stopPoll();
    let playlist: PlaylistSong[] = [];
    this.songDTOList$.pipe().subscribe((songList) => {
      if(playlist.length == 0) {
        for (const playlistSong of songList) {
          playlist.push(playlistSong);
        }
      }
    });
    const dialogRef = this._dialog.open(ChooseMusicComponent, {
      width: '720px',
      height: '65vh',
      data: {playlist: playlist}
    });
    dialogRef.afterClosed().subscribe(async (result: SavePlaylist) => {
      if (result) {
        this.storeService.playlist$.pipe(take(1)).subscribe((playlist) => {
          playlist.songDTOList = result.playlistSongDTOList;
          playlist.actualSong = result.playlistSongDTOList[0];
        });
        this.acualSongName$ = this.storeService.playlist$.pipe(map((playlist) => playlist.actualSong.name));
        this._liveBackendService.postSavePlaylist(result);
      }
      await this.startPollAfterAction();
    });
  }

}
