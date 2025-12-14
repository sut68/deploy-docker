import type { Sound } from "./Sound";
import type { Member } from "./Member";

export interface Rating {
  ID: number;
  score: number;
  sound_id: number;
  sound?: Sound;
  member_id: number;
  member?: Member;
}

export interface CreateRatingRequest {
  score: number;
  sound_id: number;
  member_id: number;
}

export interface FindRatingsRequest {
  sound_id?: number;
  member_id?: number;
}
