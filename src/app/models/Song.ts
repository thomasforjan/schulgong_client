import {Ringtime} from "./Ringtime";

/**
 * @author: Thomas Forjan, Philipp Wildzeiss, Martin Kral
 * @version: 0.0.2
 * @since: April 2023
 * @description: Models for the playlist song
 */
export interface Song {
  id: number;
  name: string;
  filePath: string;
}

export interface SongResponse {
  _embedded: {
    songDTOList: Song[];
  }
}
