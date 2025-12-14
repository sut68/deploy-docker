import type { Playlist } from "./Playlist";
import type { Sound } from "./Sound";

export interface SoundPlaylist {
  ID: number;
  playlist_id: number;
  playlist?: Playlist;
  sound_id: number;
  sound?: Sound;
}
