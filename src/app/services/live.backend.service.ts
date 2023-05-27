import {Injectable} from "@angular/core";
import {Observable} from "rxjs";
import {StoreService} from "./store.service";
import {HttpClient, HttpResponse} from "@angular/common/http";

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
   * @description URL to live endpoint
   */
  private readonly _LIVE_URL = '/live';
  private readonly _LIVE_ALARM_ISPLAYING_URL = '/alarm/isplaying';

  /**
   * @description Constructor
   * @param _storeService Injected StoreService
   * @param _http Injected HttpClient
   */
  constructor(private _storeService: StoreService, private _http: HttpClient) {
  }

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
    this._http.post<boolean>(
      `${this._storeService.BACKEND_URL}${this._LIVE_URL}/alarm`, data).subscribe();
  }

  /**
   * POST Announcement Request
   * @description POST HTTP-Method to play the announcement on speakers
   * @param data Blob
   */
  postLiveAnnouncement(
    data: Blob
  ) {
    return this._http.post<Blob>(
      `http://localhost:8080/live`,
      data
    ).subscribe();
  }

}
