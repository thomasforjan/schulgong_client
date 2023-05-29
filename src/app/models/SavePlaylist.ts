import {PlaylistSong} from "./PlaylistSong";
import {Song} from "./Song";

/**
 * @author: Thomas Forjan, Philipp Wildzeiss, Martin Kral
 * @version: 0.0.2
 * @since: May 2023
 * @description: Models for the playlist
 */
export interface SavePlaylist {
  songListChanged: boolean;
  playlistSongDTOList: PlaylistSong[];
  actualSongList: Song[];
}

