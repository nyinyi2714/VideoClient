import { VideoType } from "./Video";

export type UserProfileType = {
  username: string;
  totalVideos: number;
  videos: VideoType[];
}