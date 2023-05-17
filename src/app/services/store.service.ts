import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Ringtime } from '../models/Ringtime';
import { Ringtone } from '../models/Ringtone';
import { Holiday } from '../models/Holiday';

/**
 * @author: Thomas Forjan, Philipp Wildzeiss, Martin Kral
 * @version: 0.0.2
 * @since: April 2023
 * @description: Service to store data from backend and global information
 */

/**
 * Enum for routing links
 */
export enum RoutingLinks {
  DashboardLink = '',
  RingtonesLink = 'ringtones',
  RingtimeLink = 'ringtime',
  LiveLink = 'live',
  HolidayLink = 'holiday',
  CalendarLink = 'calendar',
  UserLink = 'user',
}

/**
 * Enum for routing names
 */
export enum MenuNames {
  Dashboard = 'Dashboard',
  Ringtones = 'Klingeltöne',
  Ringtime = 'Klingelzeit',
  Live = 'Live',
  Holiday = 'Schulfrei',
  Calendar = 'Kalender',
  User = 'Benutzer',
}

/**
 * Enum for Tab-Title names
 */
export enum TabTitleNames {
  Schulgong = 'Schulgong - ',
  Dashboard = 'Dashboard',
  Ringtones = 'Klingeltöne',
  Ringtime = 'Klingelzeit',
  Live = 'Live',
  Holiday = 'Schulfrei',
  Calendar = 'Kalender',
  User = 'Benutzer',
}

/**
 * Icons for sidebar
 */
export enum MenuIcons {
  DashboardIcon = '../../../assets/images/sidebar/dashboard.svg',
  RingtonesIcon = '../../../assets/images/sidebar/music_note.svg',
  RingtimeIcon = '../../../assets/images/sidebar/access_time.svg',
  LiveIcon = '../../../assets/images/sidebar/live.svg',
  HolidayIcon = '../../../assets/images/sidebar/holiday.svg',
  CalendarIcon = '../../../assets/images/sidebar/calendar.svg',
  UserIcon = '../../../assets/images/sidebar/user.svg',
}

/**
 * Enum for hero images
 */
export enum HeroImages {
  RingtonesHeroImage = '../../../assets/images/pages/music_note.svg',
  RingtimeHeroImage = '../../../assets/images/pages/access_time.svg',
  HolidayHeroImage = '../../../assets/images/pages/holiday.svg',
  DeleteHeroImage = '../../../assets/images/pages/delete_shield.svg',
}

/**
 * Icons for dashboard
 */
export enum DashboardIcons {
  RingtonesIcon = '../../../assets/images/dashboard/music_note.svg',
  RingtimeIcon = '../../../assets/images/dashboard/access_time.svg',
  LiveIcon = '../../../assets/images/dashboard/live.svg',
  HolidayIcon = '../../../assets/images/dashboard/holiday.svg',
  CalendarIcon = '../../../assets/images/dashboard/calendar.svg',
  UserIcon = '../../../assets/images/dashboard/user.svg',
}

@Injectable({
  providedIn: 'root',
})
export class StoreService {
  /**
   * @description URL to backend endpoint
   */
  public readonly BACKEND_URL = 'https://schulgong-server-dev.herokuapp.com';

  // private BehaviorSubject for ringtoneList
  private _ringtoneList$ = new BehaviorSubject<Ringtone[]>([]);

  // public Observable instance for ringtoneList
  public ringtoneList$ = this._ringtoneList$.asObservable();
  /**
   * private BehaviorSubject for ringtimeList
   */
  private _ringtimeList$ = new BehaviorSubject<Ringtime[]>([]);
  /**
   * public Observable instance for ringtimeList
   */
  public ringtimeList$ = this._ringtimeList$.asObservable();
  /**
   * private BehaviorSubject for holidayList
   */
  private _holidayList$ = new BehaviorSubject<Holiday[]>([]);
  /**
   * public Observable instance for holidayList
   */
  public holidayList$ = this._holidayList$.asObservable();

  // Method to update ringtoneList
  updateRingtoneList(newList: Ringtone[]) {
    this._ringtoneList$.next(newList);
  }

  /**
   * Method to update ringtimeList
   * @param newList ringtime list
   */
  updateRingtimeList(newList: Ringtime[]) {
    this._ringtimeList$.next(newList);
  }

  /**
   * Method to update holidayList
   * @param newList holiday list
   */
  updateHolidayList(newList: Holiday[]) {
    this._holidayList$.next(newList);
  }
}
