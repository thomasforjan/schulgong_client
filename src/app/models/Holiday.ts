/**
 - author: Thomas Forjan, Philipp Wildzeiss, Martin Kral
 - version: 0.0.1
 - date: April 2023
 - description: Models for holidays
 */
export interface Holiday {
  id: number;
  name: string;
  startDate: Date;
  endDate: Date;
}

export interface HolidayPayload {
  name: string;
  startDate: Date;
  endDate: Date;
}

export interface HolidayResponse {
  _embedded: {
    holidayDTOList: Holiday[];
  };
}

