import axios from "axios";
import type { AxiosResponse, AxiosError } from "axios";
import type {
  CreateMemberRequest,
  LoginMemberRequest,
  CreateCreatorRequest,
  LoginCreatorRequest,
  CreateSoundRequest,
  UpdateSoundRequest,
  CreatePlaylistRequest,
  UpdatePlaylistRequest,
  AddToPlaylistRequest,
  CreateHistoryRequest,
  CreateRatingRequest,
  FindRatingsRequest,
} from "../../interfaces";

const API_URL = import.meta.env.VITE_API_KEY || "http://localhost:8088";

const getCookie = (name: string): string | null => {
  const cookies = document.cookie.split("; ");
  const cookie = cookies.find((row) => row.startsWith(`${name}=`));

  if (cookie) {
    let AccessToken = decodeURIComponent(cookie.split("=")[1]);
    AccessToken = AccessToken.replace(/\\/g, "").replace(/"/g, "");
    return AccessToken ? AccessToken : null;
  }
  return null;
};

const getConfig = () => ({
  headers: {
    Authorization: `Bearer ${getCookie("0195f494-feaa-734a-92a6-05739101ede9")}`,
    "Content-Type": "application/json",
  },
});

const getConfigWithoutAuth = () => ({
  headers: {
    "Content-Type": "application/json",
  },
});

export const Post = async (
  url: string,
  data: any,
  requireAuth: boolean = true
): Promise<AxiosResponse | any> => {
  const config = requireAuth ? getConfig() : getConfigWithoutAuth();
  return await axios
    .post(`${API_URL}${url}`, data, config)
    .then((res) => res)
    .catch((error: AxiosError) => {
      if (error?.response?.status === 401) {
        localStorage.clear();
        window.location.reload();
      }
      return error.response;
    });
};

export const Get = async (
  url: string,
  requireAuth: boolean = true
): Promise<AxiosResponse | any> => {
  const config = requireAuth ? getConfig() : getConfigWithoutAuth();
  return await axios
    .get(`${API_URL}${url}`, config)
    .then((res) => res.data)
    .catch((error: AxiosError) => {
      if (error?.message === "Network Error") {
        return error.response;
      }
      if (error?.response?.status === 401) {
        localStorage.clear();
        window.location.reload();
      }
      return error.response;
    });
};

export const Update = async (
  url: string,
  data: any,
  requireAuth: boolean = true
): Promise<AxiosResponse | any> => {
  const config = requireAuth ? getConfig() : getConfigWithoutAuth();
  return await axios
    .put(`${API_URL}${url}`, data, config)
    .then((res) => res.data)
    .catch((error: AxiosError) => {
      if (error?.response?.status === 401) {
        localStorage.clear();
        window.location.reload();
      }
      return error.response;
    });
};

export const Delete = async (
  url: string,
  requireAuth: boolean = true
): Promise<AxiosResponse | any> => {
  const config = requireAuth ? getConfig() : getConfigWithoutAuth();
  return await axios
    .delete(`${API_URL}${url}`, config)
    .then((res) => res.data)
    .catch((error: AxiosError) => {
      if (error?.response?.status === 401) {
        localStorage.clear();
        window.location.reload();
      }
      return error.response;
    });
};

// Authentication APIs
export const authAPI = {
  // Member authentication
  memberSignup: (data: CreateMemberRequest) =>
    Post("/member/signup", data, false),
  memberLogin: (data: LoginMemberRequest) => Post("/member/auth", data, false),

  // Creator authentication
    creatorSignup: (data: CreateCreatorRequest) =>
    Post("/creator/signup", data, false),
  creatorLogin: (data: LoginCreatorRequest) =>
    Post("/creator/auth", data, false),
};

// Member APIs
export const memberAPI = {
  getAll: () => Get("/members"),
  getById: (id: number) => Get(`/member/${id}`),
  delete: (id: number) => Delete(`/member/${id}`),
};

// Creator APIs
export const creatorAPI = {
  getAll: () => Get("/creators"),
  getById: (id: number) => Get(`/creator/${id}`),
  delete: (id: number) => Delete(`/creator/${id}`),
};

// Sound APIs
export const soundAPI = {
  create: (data: CreateSoundRequest) => Post("/new-sound", data),
  getAll: () => Get("/sounds"),
  getById: (id: number) => Get(`/sound/${id}`),
  update: (data: UpdateSoundRequest) => Update("/sound/update", data),
  delete: (id: number) => Delete(`/sound/${id}`),
};

// Rating APIs
export const ratingAPI = {
  create: (data: CreateRatingRequest) => Post("/new-rating", data),
  find: (data: FindRatingsRequest) => Post("/ratings", data),
};

// Playlist APIs
export const playlistAPI = {
  create: (data: CreatePlaylistRequest) => Post("/new-playlist", data),
  getAll: () => Get("/playlists"),
  getById: (id: number) => Get(`/playlist/${id}`),
  update: (data: UpdatePlaylistRequest) => Update("/playlist/update", data),
  delete: (id: number) => Delete(`/playlist/${id}`),
  addToPlaylist: (data: AddToPlaylistRequest) => Post("/add-to-playlist", data),
    removeFromPlaylist: (playlistId: number) =>
    Delete(`/remove-out-from-playlist/${playlistId}`),
};

// History APIs
export const historyAPI = {
  create: (data: CreateHistoryRequest) => Post("/new-history", data),
  getAll: () => Get("/histories"),
  delete: (id: number) => Delete(`/history/${id}`),
};

// Sound Type APIs
export const soundTypeAPI = {
  getAll: () => Get("/sound-types"),
};
