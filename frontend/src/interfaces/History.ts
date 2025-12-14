import type { Sound } from "./Sound";
import type { Member } from "./Member";

export interface History {
  ID: number;
  played_at: string;
  sound_id: number;
  sound?: Sound;
  member_id: number;
  member?: Member;
}

export interface CreateHistoryRequest {
  played_at: string;
  sound_id: number;
  member_id: number;
}
