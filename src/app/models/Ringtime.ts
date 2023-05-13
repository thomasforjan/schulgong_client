import {Ringtone} from './Ringtone';
import {Time} from "@angular/common";

/**
 * @author: Thomas Forjan, Philipp Wildzeiss, Martin Kral
 * @version: 0.0.2
 * @since: April 2023
 * @description: Models for the ringtime component
 */
export interface Ringtime {
  id: number;
  name: string;
  ringtoneDTO: Ringtone;
  startDate: Date;
  endDate: Date;
  playTime: Time;
  monday: boolean;
  tuesday: boolean;
  wednesday: boolean;
  thursday: boolean;
  friday: boolean;
  saturday: boolean;
  sunday: boolean;
}

export interface RingtimePayload {
  name: string;
  ringtoneDTO: RingtoneOnlyId;
  startDate: Date;
  endDate: Date;
  playTime: Time;
  monday: boolean;
  tuesday: boolean;
  wednesday: boolean;
  thursday: boolean;
  friday: boolean;
  saturday: boolean;
  sunday: boolean;
}

export interface RingtimeResponse {
  _embedded: {
    ringtimeDTOList: Ringtime[];
  }
}

export interface RingtimeDialog {
  id: number;
  name: string;
  ringtoneId: number;
  startDate: Date;
  endDate: Date;
  playTime: Time;
  monday: boolean;
  tuesday: boolean;
  wednesday: boolean;
  thursday: boolean;
  friday: boolean;
  saturday: boolean;
  sunday: boolean;
}

export interface RingtoneOnlyId {
  id: number;
}
