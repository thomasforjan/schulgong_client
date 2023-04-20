import { Ringtone } from './Ringtone';
import {Time} from "@angular/common";

export interface RingTime {
  id: number;
  name: string;
  ringToneDTO: Ringtone;
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

export interface RingTimePayload {
  name: string;
  ringToneDTO: RingToneOnlyId;
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

export interface RingTimeResponse {
  _embedded: {
    ringTimeDTOList: RingTime[];
  }
}

export interface RingTimeDialog {
  id: number;
  name: string;
  ringToneId: number;
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

export interface RingToneOnlyId {
  id: number;
}
