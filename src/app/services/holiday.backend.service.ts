import {Injectable} from "@angular/core";
import {Observable, tap} from "rxjs";
import {Holiday, HolidayPayload, HolidayResponse} from "../models/Holiday";
import {map} from "rxjs/operators";
import {StoreService} from "./store.service";
import {HttpClient, HttpResponse} from "@angular/common/http";

/**
 * @author: Thomas Forjan, Philipp Wildzeiss, Martin Kral
 * @version: 0.0.2
 * @since: April 2023
 * @description: Service for the connection to the backend (CRUD)
 */
@Injectable({
  providedIn: 'root',
})
export class HolidayBackendService {

  /**
   * @description URL to holiday endpoint
   */
  private readonly _HOLIDAY_URL = '/holidays';
  private readonly _HOLIDAY_TODAY_URL = '/today';

  /**
   * @description Constructor
   * @param _storeService Injected StoreService
   * @param _http Injected HttpClient
   */
  constructor(private _storeService: StoreService, private _http: HttpClient) {
  }

  /**
   * GET Holidays from server
   * @description GET HTTP-Method to retrive Holidays from server
   * @returns Observable<Holiday[] | null>
   */
  getHolidayResponse(): Observable<Holiday[] | null> {
    return this._http
      .get<HolidayResponse>(`${this._storeService.BACKEND_URL}${this._HOLIDAY_URL}`, {
        observe: 'response',
      })
      .pipe(
        map((response) => {
          if (response.body && response.body._embedded) {
            return response.body._embedded.holidayDTOList;
          }
          return null;
        }),
        tap((holidayList) => {
          if (holidayList) {
            this._storeService.updateHolidayList(holidayList);
          }
        })
      );
  }

  /**
   * POST Holiday Request
   * @description POST HTTP-Method to create Holiday on server
   * @param data HolidayPayload
   * @returns Observable<HttpResponse<Holiday>>
   */
  postHolidayRequest(data: HolidayPayload): Observable<HttpResponse<Holiday>> {
    return this._http.post<Holiday>(
      `${this._storeService.BACKEND_URL}${this._HOLIDAY_URL}`,
      data,
      {
        observe: 'response',
      }
    );
  }

  /**
   * PUT Holiday Resource
   * @description PUT HTTP-Method to update Holiday entry on server
   * @param data FormData
   * @param holidayId number
   * @returns Observable<HttpResponse<Holiday>>
   */
  updateHolidayResource(
    data: FormData,
    holidayId: number
  ): Observable<HttpResponse<Holiday>> {
    return this._http.put<Holiday>(
      `${this._storeService.BACKEND_URL}${this._HOLIDAY_URL}/${holidayId}`,
      data,
      {
        observe: 'response',
      }
    );
  }

  /**
   * DELETE Holiday Resource
   * @description DELETE HTTP-Method to delete Holiday from server
   * @param holidayID number
   * @returns Observable<void>
   */
  deleteHolidayResource(holidayID: number): Observable<void> {
    return this._http.delete<void>(
      `${this._storeService.BACKEND_URL}${this._HOLIDAY_URL}/${holidayID}`
    );
  }

  /**
   * @description Fetch the holiday object for the current day from the backend API.
   * @returns An observable that emits the Holiday object for today or throws an error if no holiday is found.
   */
  getHolidayToday(): Observable<number> {
    return this._http.get<number>(
      `${this._storeService.BACKEND_URL}${this._HOLIDAY_URL}${this._HOLIDAY_TODAY_URL}`
    );
  }

}
