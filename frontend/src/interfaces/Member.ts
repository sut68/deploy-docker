import type { History } from "./History";

export interface Member {
  ID: number;
  username: string;
  password?: string;
  email: string;
  histories?: History[];
}

export interface CreateMemberRequest {
  username: string;
  password: string;
  email: string;
}

export interface LoginMemberRequest {
  username: string;
  password: string;
}

// Keep old interfaces for backward compatibility
export interface MemberInterface {
  ID?: number;
  username: string;
  password: string;
  email: string;
  histories?: HistoryInterface[];
}

export interface HistoryInterface {
  ID?: number;
  playedAt?: Date;
  soundID?: number;
  sound?: string;
  memberID?: number;
  member?: string;
}
