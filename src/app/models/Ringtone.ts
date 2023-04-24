/**
 - author: Thomas Forjan, Philipp Wildzeiss, Martin Kral
 - version: 0.0.1
 - date: April 2023
 - description: Models for ringtones
 */

export interface Ringtone {
  id: number;
  name: string;
  filename: string;
  path: string;
  date: string;
  size: number;
}

export interface RingtonePayload {
  name: string;
  filename: string;
  path: string;
  date: Date;
  size: number;
}

export interface RingtoneResponse {
  _embedded: {
    ringtoneDTOList: Ringtone[];
  };
}

