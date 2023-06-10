import { Injectable } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { StoreService } from './store.service';
import { HttpClient } from '@angular/common/http';
import { Configuration } from '../models/Configuration';

/**
 * @author: Thomas Forjan, Philipp Wildzeiss, Martin Kral
 * @version: 0.0.2
 * @since: May 2023
 * @description: Service for the connection to the backend (CRUD)
 */
@Injectable({
  providedIn: 'root',
})
export class SettingsBackendService {
  /**
   * @description URLs to live endpoint
   */
  private readonly _SETTINGS_URL = '/settings';
  private readonly _SETTINGS_SET_RINGTIME_VOLUME_URL = '/volume/ringtime';
  private readonly _SETTINGS_SET_ALARM_VOLUME_URL = '/volume/alarm';
  private readonly _SETTINGS_SET_ANNOUNCEMENT_VOLUME_URL =
    '/volume/announcement';

  /**
   * @description Constructor
   * @param _storeService Injected StoreService
   * @param _http Injected HttpClient
   */
  constructor(private _storeService: StoreService, private _http: HttpClient) {}

  /**
   * Get the Playlist from the backend
   */
  getConfiguration(): Observable<Configuration> {
    return this._http.get<Configuration>(
      `${this._storeService.BACKEND_URL}${this._SETTINGS_URL}`
    );
  }

  /**
   * Post ringtime volume
   * @param volume of the ringtimes
   */
  postRingtimeVolume(volume: number) {
    return this._http
      .post(
        `${this._storeService.BACKEND_URL}${this._SETTINGS_URL}${this._SETTINGS_SET_RINGTIME_VOLUME_URL}/${volume}`,
        undefined
      )
      .subscribe();
  }

  /**
   * Post alarm volume
   * @param volume of the alarm
   */
  postAlarmVolume(volume: number) {
    return this._http
      .post(
        `${this._storeService.BACKEND_URL}${this._SETTINGS_URL}${this._SETTINGS_SET_ALARM_VOLUME_URL}/${volume}`,
        undefined
      )
      .subscribe();
  }

  /**
   * Post announcement volume
   * @param volume of the announcement
   */
  postAnnouncementVolume(volume: number) {
    return this._http
      .post(
        `${this._storeService.BACKEND_URL}${this._SETTINGS_URL}${this._SETTINGS_SET_ANNOUNCEMENT_VOLUME_URL}/${volume}`,
        undefined
      )
      .subscribe();
  }
}
