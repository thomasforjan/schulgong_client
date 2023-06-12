import {Injectable} from '@angular/core';
import {BehaviorSubject} from 'rxjs';
import {Ringtime} from '../models/Ringtime';
import {Ringtone} from '../models/Ringtone';
import {Holiday} from '../models/Holiday';
import {Playlist} from '../models/Playlist';
import {Song} from '../models/Song';
import {Configuration} from "../models/Configuration";

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
  SettingsLink = 'settings',
  MusicLink = 'music',
  LoginLink = 'login',
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
  Settings = 'Einstellungen',
  Music = 'Musik spielen',
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
  Settings = 'Einstellungen',
  Music = 'Musik',
  Login = 'Anmelden',
}

/**
 * Enum for Live names
 */
export enum LiveNames {
  Microphone = 'Live',
  Music = 'Musik',
  Alarm = 'Alarm',
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
  SettingsIcon = '../../../assets/images/sidebar/settings.svg',
}

/**
 * Enum for hero images
 */
export enum HeroImages {
  RingtonesHeroImage = '../../../assets/images/pages/music_note.svg',
  RingtimeHeroImage = '../../../assets/images/pages/access_time.svg',
  HolidayHeroImage = '../../../assets/images/pages/holiday.svg',
  DeleteHeroImage = '../../../assets/images/pages/delete_shield.svg',
  LiveHeroImage = '../../../assets/images/pages/live.svg',
  CalendarHeroImage = '../../../assets/images/pages/calendar.svg',
  SettingsHeroImage = '../../../assets/images/pages/settings.svg',
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
  SettingsIcon = '../../../assets/images/dashboard/settings.svg',
}

/**
 * Icons for live component
 */
export enum LiveIcons {
  MicrophoneIcon = '../../assets/images/pages/live/microphone.svg',
  MusicIcon = '../../../assets/images/pages/live/music.svg',
  AlarmIcon = '../../../assets/images/pages/live/alarm.svg',
  RecordIcon = '../../../assets/images/pages/live/record.svg',
}

export enum ButtonValue {
  submitButton = "Bestätigen",
  cancelButton = "Abbrechen",
  uploadButton = "Upload",
  addButton = "Hinzufügen",
  deleteAllButton = "Alle Löschen"
}

export enum ButtonWidths {
  submitButton = 125,
  cancelButton = 125,
  uploadButton = 110,
  addButton = 130,
  deleteAllButton = 130
}

export enum ButtonHeight {
  submitButton = 45,
  cancelButton = 45,
  uploadButton = 45,
  addButton = 40,
  deleteAllButton = 40
}

@Injectable({
  providedIn: 'root',
})
export class StoreService {
  /**
   * @description URL to backend endpoint
   */
  public readonly BACKEND_URL = 'https://schulgong-server-dev.herokuapp.com';

  /**
   * public flag if alarm is running
   */
  public isAlarmEnabled = false;

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

  /**
   * private BehaviorSubject for playlist
   */
  private _playlist$ = new BehaviorSubject<Playlist>({
    speakerState: 'STOPPED',
    volume: 0,
    mute: false,
    actualSong: {
      id: 0,
      index: 0,
      name: '',
      filePath: '',
      song: '',
    },
    songDTOList: [],
  });
  /**
   * public Observable instance for playlist
   */
  public playlist$ = this._playlist$.asObservable();

  /**
   * private BehaviorSubject for songList
   */
  private _songList$ = new BehaviorSubject<Song[]>([]);
  /**
   * public Observable instance for songList
   */
  public songList$ = this._songList$.asObservable();

  /**
   * private BehaviorSubject for configuration
   */
  private _configuration$ = new BehaviorSubject<Configuration>({
    alarmVolume: 0, announcementVolume: 0, password: "", playlistDirectory: "", ringtimeDirectory: "", ringtimeVolume: 0
  });

  /**
   * public Observable instance for configuration
   */
  public configuration$ = this._configuration$.asObservable();

  /**
   * Method to update ringtoneList
   * @param newList ringtone list
   */
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

  /**
   * Method to update playList
   * @param newPlaylist new playList
   */
  updatePlaylist(newPlaylist: Playlist) {
    this._playlist$.next(newPlaylist);
  }

  /**
   * Method to update songList
   * @param newList song list
   */
  updateSongList(newList: Song[]) {
    this._songList$.next(newList);
  }

  /**
   * Method to update configuration
   * @param newConfiguration new configuration
   */
  updateConfiguration(newConfiguration: Configuration) {
    this._configuration$.next(newConfiguration);
  }
}
