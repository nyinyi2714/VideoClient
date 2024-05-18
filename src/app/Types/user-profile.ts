import { VideoType } from "./video";

export type UserProfileType = {
  username: string;
  totalVideos: number;
  videos: VideoType[];
}