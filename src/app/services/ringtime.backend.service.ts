import {Injectable} from "@angular/core";
import {StoreService} from "./store.service";
import {HttpClient, HttpResponse} from "@angular/common/http";
import {Observable, tap} from "rxjs";
import {Ringtime, RingtimePayload, RingtimeResponse} from "../models/Ringtime";
import {map} from "rxjs/operators";

/**
 * @author: Thomas Forjan, Philipp Wildzeiss, Martin Kral
 * @version: 0.0.2
 * @since: April 2023
 * @description: Service for the connection to the backend (CRUD) for ringtimes
 */
@Injectable({
  providedIn: 'root',
})
export class RingtimeBackendService {

  /**
   * @description URLs to ringtime endpoint
   */
  private readonly _RINGTIME_URL = '/ringtimes';
  private readonly _RINGTIME_SERVER_TIME_URL = '/server-time';

  /**
   * @description Constructor
   * @param _storeService Injected StoreService
   * @param _http Injected HttpClient
   */
  constructor(private _storeService: StoreService, private _http: HttpClient) {
  }


  /**
   * GET Ringtimes from server
   * @description GET HTTP-Method to retrive Ringtimes from server
   * @returns Observable<Ringtime[] | null>
   */
  getRingtimeResponse(): Observable<Ringtime[] | null> {
    return this._http
      .get<RingtimeResponse>(`${this._storeService.BACKEND_URL}${this._RINGTIME_URL}`, {
        observe: 'response',
      })
      .pipe(
        map((response) => {
          if (response.body && response.body._embedded) {
            return response.body._embedded.ringtimeDTOList;
          }
          return null;
        }),
        tap((ringtimeList) => {
          if (ringtimeList) {
            this._storeService.updateRingtimeList(ringtimeList);
          }
        })
      );
  }

  /**
   * POST Ringtime Request
   * @description POST HTTP-Method to create Ringtime on server
   * @param data RingtimePayload
   * @returns Observable<HttpResponse<Ringtime>>
   */
  postRingtimeRequest(
    data: RingtimePayload
  ): Observable<HttpResponse<Ringtime>> {
    return this._http.post<Ringtime>(
      `${this._storeService.BACKEND_URL}${this._RINGTIME_URL}`,
      data,
      {
        observe: 'response',
      }
    );
  }

  /**
   * PUT Ringtime Resource
   * @description PUT HTTP-Method to update Ringtime on server
   * @param ringtime Ringtime
   * @returns Observable<HttpResponse<Ringtime>>
   */
  updateRingtimeResource(
    ringtime: Ringtime
  ): Observable<HttpResponse<Ringtime>> {
    return this._http.put<Ringtime>(
      `${this._storeService.BACKEND_URL}${this._RINGTIME_URL}/${ringtime.id}`,
      ringtime,
      {
        observe: 'response',
      }
    );
  }

  /**
   * DELETE Ringtime Resource
   * @description DELETE HTTP-Method to delete Ringtime from server
   * @param ringtimeId number
   * @returns Observable<void>
   */
  deleteRingtimeResource(ringtimeId: number): Observable<void> {
    return this._http.delete<void>(
      `${this._storeService.BACKEND_URL}${this._RINGTIME_URL}/${ringtimeId}`
    );
  }

  /**
   * GET Server Time from server
   * @description GET HTTP-Method to retrive Server Time from server
   * @returns Observable<{ time: string }>
   */
  getServerTime(): Observable<{ time: string }> {
    return this._http.get<{ time: string }>(
      `${this._storeService.BACKEND_URL}${this._RINGTIME_URL}${this._RINGTIME_SERVER_TIME_URL}`
    );
  }

}
