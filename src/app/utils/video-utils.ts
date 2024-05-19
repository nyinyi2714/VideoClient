import { Injectable } from "@angular/core";

@Injectable({
  providedIn: 'root'
})
export class VideoUtils {
  reloadVideoPlayers() {
    const videos: NodeListOf<HTMLVideoElement> = document.querySelectorAll('video') as NodeListOf<HTMLVideoElement>;
    if (videos) {
      videos.forEach((v: HTMLVideoElement) => {
        v.load();
      });
    }
  }
}