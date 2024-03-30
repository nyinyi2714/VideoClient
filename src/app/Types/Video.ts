import { UserType } from "./User";

export type VideoType = {
  videoId: Number;
  url: String;
  title: String;
  description: String;
  likes: Number;
  timestamp: String;
  user: UserType;
}