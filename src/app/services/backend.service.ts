import {Injectable} from '@angular/core';
import {StoreService} from './store.service';
import {HttpClient, HttpResponse} from '@angular/common/http';
import {map, Observable} from 'rxjs';
import {Ringtone, RingtonePayload, RingtoneResponse} from "../models/Ringtone";


@Injectable({
  providedIn: 'root',
})
export class BackendService {
  /**
   * @description URL to backend
   */
  private readonly BACKEND_URL = 'http://localhost:8080';
  private readonly RINGTONE_URL = '/ringtones';

  constructor(private storeService: StoreService, private http: HttpClient) {
  }

  /** Read Method */
  getRingtoneResponse(): Observable<Ringtone[] | null> {
    return this.http
      .get<RingtoneResponse>(`${this.BACKEND_URL}${this.RINGTONE_URL}`, {
        observe: 'response',
      })
      .pipe(
        map((response) => {
          if (
            response.body &&
            response.body._embedded &&
            response.body._embedded.ringtoneDTOList
          ) {
            const ringtoneList = response.body._embedded.ringtoneDTOList;
            return ringtoneList.map((ringtoneDTO) => ({
              id: ringtoneDTO.id,
              name: ringtoneDTO.name,
              filename: ringtoneDTO.filename,
              path: ringtoneDTO.path,
              date: ringtoneDTO.date,
              size: ringtoneDTO.size,
            }));
          }
          return null;
        })
      );
  }

  /** Post Method */
  postRingtoneRequest(
    data: RingtonePayload
  ): Observable<HttpResponse<Ringtone>> {
    return this.http.post<Ringtone>(
      `${this.BACKEND_URL}${this.RINGTONE_URL}`,
      data,
      {
        observe: 'response',
      }
    );
  }

  /**
   * Update Ringtone Resource
   */
  updateRingtoneResource(
    data: FormData,
    ringtoneId: number
  ): Observable<HttpResponse<Ringtone>> {
    return this.http.put<Ringtone>(
      `${this.BACKEND_URL}${this.RINGTONE_URL}/${ringtoneId}`,
      data,
      {
        observe: 'response',
      }
    );
  }

  /** Delete Method */
  deleteRingtoneResource(id: number): Observable<void> {
    return this.http.delete<void>(
      `${this.BACKEND_URL}${this.RINGTONE_URL}/${id}`
    );
  }
}
