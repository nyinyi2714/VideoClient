import { UserType } from "./User";

export type VideoType = {
  videoId: number;
  url: string;
  title: string;
  description: string;
  likes: number;
  timestamp: string;
  user: UserType;
}