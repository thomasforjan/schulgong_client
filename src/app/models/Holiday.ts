/**
 * @author: Thomas Forjan, Philipp Wildzeiss, Martin Kral
 * @version: 0.0.2
 * @since: May 2023
 * @description: Models for the holidays component
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

