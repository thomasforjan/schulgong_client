import {Injectable} from '@angular/core';
import {StoreService} from './store.service';
import {HttpClient, HttpResponse} from '@angular/common/http';
import {map, Observable} from 'rxjs';
import {Ringtime, RingtimePayload, RingtimeResponse} from "../models/Ringtime";
import {Ringtone, RingtonePayload, RingtoneResponse} from "../models/Ringtone";
import {Holiday, HolidayResponse} from "../models/Holiday";


@Injectable({
  providedIn: 'root',
})
export class BackendService {

  /**
   * @description URL to backend
   */
  private readonly BACKEND_URL = 'http://localhost:8080';
  private readonly RINGTONE_URL = '/ringtones';
  private readonly HOLIDAY_URL = '/holidays';


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

  /** Read Method */
  getHolidayResponse(): Observable<Holiday[] | null> {
    return this.http
      .get<HolidayResponse>(`${this.BACKEND_URL}${this.HOLIDAY_URL}`, {
        observe: 'response',
      })
      .pipe(
        map((response) => {
          if (
            response.body &&
            response.body._embedded &&
            response.body._embedded.holidayDTOList
          ) {
            const holidayList = response.body._embedded.holidayDTOList;
            return holidayList.map((holidayDTO) => ({
              id: holidayDTO.id,
              startDate: holidayDTO.startDate,
              endDate: holidayDTO.endDate,
              name: holidayDTO.name,
            }));
          }
          return null;
        })
      );
  }

  /** Delete Method */
  deleteHolidayResource(id: number): Observable<void> {
    return this.http.delete<void>(
      `${this.BACKEND_URL}${this.HOLIDAY_URL}/${id}`
    );
  }
}
