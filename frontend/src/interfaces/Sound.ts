import type { Creator } from "./Creator";
import type { SoundType } from "./SoundType";
import type { Rating } from "./Rating";

export interface Sound {
  ID: number;
  title: string;
  artist: string;
  sound_type_id: number;
  sound_type?: SoundType;
  creator_id: number;
  creator?: Creator;
  ratings?: Rating[];
}

export interface CreateSoundRequest {
  title: string;
  artist: string;
  sound_type_id: number;
  creator_id: number;
}

export interface UpdateSoundRequest {
  ID: number;
  title?: string;
  artist?: string;
  sound_type_id?: number;
}
