import { Injectable } from '@angular/core';
import { StoreService } from './store.service';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import {
  Ringtone,
  RingtonePayload,
  RingtoneResponse,
} from '../models/Ringtone';
import { map } from 'rxjs/operators';

/**
 * @author: Thomas Forjan, Philipp Wildzeiss, Martin Kral
 * @version: 0.0.2
 * @since: May 2023
 * @description: Service for the connection to the backend (CRUD) for ringtones
 */
@Injectable({
  providedIn: 'root',
})
export class RingtoneBackendService {
  /**
   * @description URLs to ringtone endpoint
   */
  private readonly _RINGTONE_URL = '/ringtones';
  private readonly _RINGTONE_FILE_URL = '/file';

  /**
   * @description Constructor
   * @param _storeService Injected StoreService
   * @param _http Injected HttpClient
   */
  constructor(private _storeService: StoreService, private _http: HttpClient) {}

  /**
   * GET Ringtones from Backend
   * @returns Observable<Ringtone[] | null>
   * @description GET HTTP-Method to retrive Ringtones from server
   */
  getRingtoneResponse(): Observable<Ringtone[] | null> {
    return this._http
      .get<RingtoneResponse>(
        `${this._storeService.BACKEND_URL}${this._RINGTONE_URL}`,
        {
          observe: 'response',
        }
      )
      .pipe(
        map((response) => {
          if (response.body && response.body._embedded) {
            return response.body._embedded.ringtoneDTOList;
          }
          return null;
        }),
        tap((ringtoneList) => {
          if (ringtoneList) {
            this._storeService.updateRingtoneList(ringtoneList);
          }
        })
      );
  }

  /**
   * @description Fetch ringtone (music file) from backend.
   * @param id The unique ID of the ringtone file.
   * @returns An observable that emits the file as a Blob or null if no file was found.
   */
  getMusicFile(id: number): Observable<Blob | null> {
    return this._http
      .get(
        `${this._storeService.BACKEND_URL}${this._RINGTONE_URL}${this._RINGTONE_FILE_URL}/${id}`,
        {
          responseType: 'blob',
          observe: 'response',
        }
      )
      .pipe(map((response) => response.body));
  }

  /**
   * POST Ringtone Request
   * @description POST HTTP-Method to create Ringtone on server
   * @param data RingtonePayload
   * @returns Observable<HttpResponse<Ringtone>>
   */
  postRingtoneRequest(
    data: RingtonePayload
  ): Observable<HttpResponse<Ringtone>> {
    return this._http.post<Ringtone>(
      `${this._storeService.BACKEND_URL}${this._RINGTONE_URL}`,
      data,
      {
        observe: 'response',
      }
    );
  }

  /**
   * PUT Ringtone Resource
   * @description PUT HTTP-Method to update Ringtone on server
   * @param data FormData
   * @param ringtoneId number
   * @returns Observable<HttpResponse<Ringtone>>
   */
  updateRingtoneResource(
    data: FormData,
    ringtoneId: number
  ): Observable<HttpResponse<Ringtone>> {
    return this._http.put<Ringtone>(
      `${this._storeService.BACKEND_URL}${this._RINGTONE_URL}/${ringtoneId}`,
      data,
      {
        observe: 'response',
      }
    );
  }

  /**
   * DELETE Ringtone Resource
   * @description DELETE HTTP-Method to delete Ringtone from server
   * @param ringtoneId number
   * @returns Observable<void>
   */
  deleteRingtoneResource(ringtoneId: number): Observable<void> {
    return this._http.delete<void>(
      `${this._storeService.BACKEND_URL}${this._RINGTONE_URL}/${ringtoneId}`
    );
  }
}
