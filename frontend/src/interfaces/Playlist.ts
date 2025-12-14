import type { Member } from "./Member";
import type { Sound } from "./Sound";
import type { SoundPlaylist } from "./SoundPlaylist";

export interface Playlist {
  ID: number;
  title: string;
  member_id: number;
  member?: Member;
  sounds?: Sound[];
  sound_playlists?: SoundPlaylist[];
}

export interface CreatePlaylistRequest {
  title: string;
  member_id: number;
  // When creating a playlist from UI we only send IDs, allow that shape
  sounds?: { ID: number }[];
}

export interface UpdatePlaylistRequest {
  ID: number;
  title?: string;
}

export interface AddToPlaylistRequest {
  playlist_id: number;
  sound_id: number;
  sounds?: Sound[];
}
