import {PlaylistSong} from "./PlaylistSong";

/**
 * @author: Thomas Forjan, Philipp Wildzeiss, Martin Kral
 * @version: 0.0.2
 * @since: May 2023
 * @description: Models for the playlist
 */
export interface Playlist {
  speakerState: string;
  volume: number | any;
  mute: boolean;
  looping: boolean;
  playingPlaylist: boolean;
  actualSong: PlaylistSong;
  songDTOList: PlaylistSong[];
}

export enum SpeakerState {
  PLAYING = "PLAYING",
  TRANSITIONING = "TRANSITIONING",
  PAUSED_PLAYBACK = "PAUSED_PLAYBACK",
  STOPPED = "STOPPED"
}
