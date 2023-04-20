import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { RingTime } from '../models/RingTime';
import {Ringtone} from "../models/Ringtone";

/**
 * Enum for routing links
 */
export enum RoutingLinks {
  DashboardLink = '',
  RingtonesLink = 'ringtones',
  RingTimeLink = 'ringTime',
  LiveLink = 'live',
  NoSchoolLink = 'noSchool',
  CalendarLink = 'calendar',
  UserLink = 'user'
}

/**
 * Enum for routing names
 */
export enum MenuNames {
  Dashboard = 'Dashboard',
  Ringtones = 'Klingeltöne',
  RingTime = 'Klingelzeit',
  Live = 'Live',
  NoSchool = 'Schulfrei',
  Calendar = 'Kalender',
  User = 'Benutzer',
}

/**
 * Icons for sidebar
 */
export enum MenuIcons {
  DashboardIcon = '../../../assets/images/sidebar/dashboard.svg',
  RingtonesIcon = '../../../assets/images/sidebar/music_note.svg',
  RingTimeIcon = '../../../assets/images/sidebar/access_time.svg',
  LiveIcon = '../../../assets/images/sidebar/live.svg',
  NoSchoolIcon = '../../../assets/images/sidebar/no_school.svg',
  CalendarIcon = '../../../assets/images/sidebar/kalendar.svg',
  UserIcon = '../../../assets/images/sidebar/user.svg',
}

/**
 * Enum for hero images
 */
export enum HeroImages {
  RingtonesHeroImage = '../../../assets/images/pages/music_note.svg',
  RingTimesHeroImage = '../../../assets/images/pages/access_time.svg',
}

/**
 * Icons for dashboard
 */
export enum DashboardIcons {
  RingtonesIcon = '../../../assets/images/dashboard/music_note.svg',
  RingTimeIcon = '../../../assets/images/dashboard/access_time.svg',
  LiveIcon = '../../../assets/images/dashboard/live.svg',
  NoSchoolIcon = '../../../assets/images/dashboard/no_school.svg',
  CalendarIcon = '../../../assets/images/dashboard/kalendar.svg',
  UserIcon = '../../../assets/images/dashboard/user.svg',
}

@Injectable({
  providedIn: 'root',
})
export class StoreService {

  // private BehaviorSubject for ringtoneList
  private _ringtoneList$ = new BehaviorSubject<Ringtone[]>([])

  // public Observable instance for ringtoneList
  public ringtoneList$ = this._ringtoneList$.asObservable();

  // Method to update ringtoneList
  updateRingtoneList(newList: Ringtone[]) {
    this._ringtoneList$.next(newList);
  }

  // private BehaviorSubject for ringTimeList
  private _ringTimeList$ = new BehaviorSubject<RingTime[]>([]);

  // public Observable instance for ringTimeList
  public ringTimeList$ = this._ringTimeList$.asObservable();

  // Method to update ringTimeList
  updateRingTimeList(newList: RingTime[]) {
    this._ringTimeList$.next(newList);
  }

  public isEditRingTime = false;
  public isAddRingTime = false;

}
