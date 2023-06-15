import { Injectable } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { StoreService } from './store.service';
import { HttpClient } from '@angular/common/http';
import { SavePlaylist } from '../models/SavePlaylist';
import { Song, SongResponse } from '../models/Song';
import { map } from 'rxjs/operators';
import { Playlist } from '../models/Playlist';
import { SpeakerCommand } from '../models/SpeakerCommand';

/**
 * @author: Thomas Forjan, Philipp Wildzeiss, Martin Kral
 * @version: 0.0.2
 * @since: May 2023
 * @description: Service for the connection to the backend (CRUD)
 */
@Injectable({
  providedIn: 'root',
})
export class LiveBackendService {
  /**
   * @description URLs to live endpoint
   */
  private readonly _LIVE_URL = '/live';
  private readonly _ALARM_URL = '/alarm';
  private readonly _LIVE_ALARM_ISPLAYING_URL = '/alarm/isplaying';
  private readonly _LIVE_MUSIC_STATE = '/music/state';
  private readonly _LIVE_PLAYLIST_COMMAND = '/music/control';
  private readonly _LIVE_PLAYLIST_REPEAT = '/music/repeat';
  private readonly _LIVE_SONG_LIST = '/music/songs/available';
  private readonly _LIVE_SAVE0_PLAYLIST = '/music/songs/save';
  private readonly _LIVE_SET_PLAYLIST = '/music/songs/set/playlist';

  /**
   * @description Constructor
   * @param _storeService Injected StoreService
   * @param _http Injected HttpClient
   */
  constructor(private _storeService: StoreService, private _http: HttpClient) {}

  /**
   * @description Fetch the play alarm flag from the backend API.
   * @returns An observable that emits the play alarm flag.
   */
  getIsPlayingAlarm(): Observable<boolean> {
    return this._http.get<boolean>(
      `${this._storeService.BACKEND_URL}${this._LIVE_URL}${this._LIVE_ALARM_ISPLAYING_URL}`
    );
  }

  /**
   * POST Alarm Request
   * @description POST HTTP-Method to start or stop playing the alarm
   * @param data flag to signal start or stop
   */
  postIsPlayingAlarmRequest(data: boolean) {
    this._http
      .post<boolean>(
        `${this._storeService.BACKEND_URL}${this._LIVE_URL}${this._ALARM_URL}`,
        data
      )
      .subscribe();
  }

  /**
   * POST Announcement Request
   * @description POST HTTP-Method to play the announcement on speakers
   * @param data Blob
   */
  postLiveAnnouncement(data: Blob) {
    return this._http
      .post<Blob>(`${this._storeService.BACKEND_URL}${this._LIVE_URL}`, data)
      .subscribe();
  }

  /**
   * GET Songs from server
   * @description GET HTTP-Method to retrive Songs from server
   * @returns Observable<Song[]>
   */
  getSongResponse(): Observable<Song[]> {
    return this._http
      .get<SongResponse>(
        `${this._storeService.BACKEND_URL}${this._LIVE_URL}${this._LIVE_SONG_LIST}`,
        {
          observe: 'response',
        }
      )
      .pipe(
        map((response) => {
          if (response.body && response.body._embedded) {
            return response.body._embedded.songDTOList;
          }
          return [];
        }),
        tap((songList) => {
          this._storeService.updateSongList(songList);
        })
      );
  }

  /**
   * POST SavePlayList Request
   * @description POST HTTP-Method to update songs and playlist on server
   * @param data SavePlaylist
   * @returns SavePlaylist
   */
  postSavePlaylist(data: SavePlaylist) {
    return this._http
      .post<SavePlaylist>(
        `${this._storeService.BACKEND_URL}${this._LIVE_URL}${this._LIVE_SAVE0_PLAYLIST}`,
        data
      )
      .subscribe();
  }

  /**
   * Get the Playlist from the backend
   */
  getPlaylist(): Observable<Playlist> {
    return this._http.get<Playlist>(
      `${this._storeService.BACKEND_URL}${this._LIVE_URL}${this._LIVE_MUSIC_STATE}`
    );
  }

  /**
   * Post Command to control the playlist
   *
   * @param data command for control the network speaker
   */
  postPlaylistCommands(data: SpeakerCommand) {
    return this._http
      .post<SpeakerCommand>(
        `${this._storeService.BACKEND_URL}${this._LIVE_URL}${this._LIVE_PLAYLIST_COMMAND}`,
        data
      )
      .subscribe();
  }

  /**
   * Post set repeat playlist
   *
   * @param data flag for turn on or off the repeat function
   */
  postPlaylistRepeat(
    data: boolean
  ) {
    return this._http.post<SpeakerCommand>(
      `${this._storeService.BACKEND_URL}${this._LIVE_URL}${this._LIVE_PLAYLIST_REPEAT}/${data}`, ""
    ).subscribe();
  }

  /**
   * Post Command to set the playlist
   *
   * @param force flag to force setting the playlist
   */
  postSetPlaylist(force: boolean) {
    return this._http
      .post(
        `${this._storeService.BACKEND_URL}${this._LIVE_URL}${this._LIVE_SET_PLAYLIST}/${force}`,
        undefined
      )
      .subscribe();
  }
}
