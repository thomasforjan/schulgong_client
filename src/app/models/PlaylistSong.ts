import {Song} from "./Song";

/**
 * @author: Thomas Forjan, Philipp Wildzeiss, Martin Kral
 * @version: 0.0.2
 * @since: May 2023
 * @description: Models for the songs of the playlist
 */
export interface PlaylistSong extends Song {
  index: number;
}
