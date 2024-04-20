import { UserType } from "./User";

export type VideoType = {
  videoId: number;
  url: string;
  title: string;
  description: string;
  views: number;
  timestamp: string;
  user: UserType;
}