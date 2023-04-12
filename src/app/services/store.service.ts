import { Injectable } from '@angular/core';

/**
 * Enum for routing links
 */
export enum RoutingLinks {
  DashboardLink = '',
  RingtonesLink = 'ringtones',
  BellTimeLink = 'bellTime',
}

/**
 * Enum for routing names
 */
export enum MenuNames {
  Dashboard = 'Dashboard',
  Ringtones = 'Klingeltöne',
  BellTime = 'Klingelzeit',
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
  BellTimeIcon = '../../../assets/images/sidebar/access_time.svg',
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
}

/**
 * Icons for dashboard
 */
export enum DashboardIcons {
  RingtonesIcon = '../../../assets/images/dashboard/music_note.svg',
  BellTimeIcon = '../../../assets/images/dashboard/access_time.svg',
  LiveIcon = '../../../assets/images/dashboard/live.svg',
  NoSchoolIcon = '../../../assets/images/dashboard/no_school.svg',
  CalendarIcon = '../../../assets/images/dashboard/kalendar.svg',
  UserIcon = '../../../assets/images/dashboard/user.svg',
}

@Injectable({
  providedIn: 'root',
})
export class StoreService {}
