export interface Ringtone {
  id: number;
  name: string;
  filename: string;
  path: string;
  date: Date;
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




