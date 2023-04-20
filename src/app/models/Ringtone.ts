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
  date: string;
  size: number;
}

export interface RingtoneResponse {
  _embedded: {
    ringToneDTOList: Ringtone[];
  };
}




