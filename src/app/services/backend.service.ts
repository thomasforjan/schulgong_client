import {Injectable} from '@angular/core';
import {StoreService} from './store.service';
import {HttpClient, HttpResponse} from '@angular/common/http';
import {Observable} from 'rxjs';
import {RingTime, RingTimePayload, RingTimeResponse} from "../models/RingTime";
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
  getRingTimeResponse(): Observable<HttpResponse<RingTimeResponse>> {
    return this.http.get<RingTimeResponse>(`${this.BACKEND_URL}/periods`, {
      observe: 'response',
    });
  }
  /** Post Method */
  postRingTimeRequest(data: RingTimePayload): Observable<HttpResponse<RingTime>> {
    return this.http.post<RingTime>(`${this.BACKEND_URL}/periods`, data, {
      observe: 'response',
    });
  }
  /** Update Method */
  updateRingTimeResource(ringTime: RingTime): Observable<HttpResponse<RingTime>> {
    console.log('BACKEND updateRingTimeResource')
    console.log(ringTime)
    return this.http.put<RingTime>(`${this.BACKEND_URL}/periods/${ringTime.id}`, ringTime, {
      observe: 'response',
    });
  }
  /** Delete Method */
  deleteRingTimeResource(id: number): Observable<void> {
    return this.http.delete<void>(`${this.BACKEND_URL}/periods/${id}`);
  }




}
