export interface Creator {
  ID: number;
  username: string;
  password?: string;
  email: string;
}

export interface CreateCreatorRequest {
  username: string;
  password: string;
  email: string;
}

export interface LoginCreatorRequest {
  username: string;
  password: string;
}
