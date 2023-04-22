import { Ringtone } from './Ringtone';
import {Time} from "@angular/common";

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
  // addInfo: string;
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
  // addInfo: string;
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
  // addInfo: string;
}

export interface RingtoneOnlyId {
  id: number;
}
