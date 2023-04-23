import {Injectable} from '@angular/core';
import {StoreService} from './store.service';
import {HttpClient, HttpResponse} from '@angular/common/http';
import {Observable} from 'rxjs';
import {Ringtime, RingtimePayload, RingtimeResponse} from "../models/Ringtime";
import {Ringtone, RingtonePayload, RingtoneResponse} from "../models/Ringtone";


@Injectable({
  providedIn: 'root',
})
export class BackendService {
  /**
   * @description URL to backend
   */
  private readonly BACKEND_URL = 'http://localhost:8080';
  private ringtoneURL = "/ringtones"

  constructor(private storeService: StoreService, private http: HttpClient) {
  }

  /** Read Method */
  getRingtoneResponse(): Observable<HttpResponse<RingtoneResponse>> {
    return this.http.get<RingtoneResponse>(`${this.BACKEND_URL}/ringtones`, {
      observe: 'response',
    });
  }

  /** Post Method */
  postRingtoneRequest(data: RingtonePayload): Observable<HttpResponse<Ringtone>> {
    return this.http.post<Ringtone>(`${this.BACKEND_URL}/ringtones`, data, {
      observe: 'response',
    });
  }

  /** Update Method */
  updateRingtoneResource(data: Ringtone): Observable<HttpResponse<Ringtone>> {
    return this.http.put<Ringtone>(`${this.BACKEND_URL}/ringtones/${data.id}`, data, {
      observe: 'response',
    });
  }

  /** Delete Method */
  deleteRingtoneResource(id: number): Observable<void> {
    return this.http.delete<void>(`${this.BACKEND_URL}/ringtones/${id}`);
  }



  /** Read Method */
  getRingtimeResponse(): Observable<HttpResponse<RingtimeResponse>> {
    return this.http.get<RingtimeResponse>(`${this.BACKEND_URL}/ringtimes`, {
      observe: 'response',
    });
  }
  /** Post Method */
  postRingtimeRequest(data: RingtimePayload): Observable<HttpResponse<Ringtime>> {
    return this.http.post<Ringtime>(`${this.BACKEND_URL}/ringtimes`, data, {
      observe: 'response',
    });
  }
  /** Update Method */
  updateRingtimeResource(ringtime: Ringtime): Observable<HttpResponse<Ringtime>> {
    console.log('BACKEND updateRingtimeResource')
    console.log(ringtime)
    return this.http.put<Ringtime>(`${this.BACKEND_URL}/ringtimes/${ringtime.id}`, ringtime, {
      observe: 'response',
    });
  }
  /** Delete Method */
  deleteRingtimeResource(id: number): Observable<void> {
    return this.http.delete<void>(`${this.BACKEND_URL}/ringtimes/${id}`);
  }




}
