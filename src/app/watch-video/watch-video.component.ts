import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { formatDate } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';

import { VideoPlayerComponent } from '../video-player/video-player.component';
import { VideoType } from '../Types/Video';
import { environment } from '../../environments/environment.development';

@Component({
  selector: 'app-watch-video',
  standalone: true,
  imports: [MatCardModule, MatButtonModule, VideoPlayerComponent],
  templateUrl: './watch-video.component.html',
  styleUrl: './watch-video.component.css'
})
export class WatchVideoComponent {
  mainVideo: VideoType | null = null;
  userVideos: VideoType[] | null = null;

  constructor(private http: HttpClient, private route: ActivatedRoute, private router: Router) { }

  ngOnInit() {
    // Access the video id from the route parameters
    let videoId: string | null = this.route.snapshot.paramMap.get("videoId");

    // Redirect to 404 page if no videoId
    if(!videoId) {
      this.router.navigate(['/page-not-found']);
      return
    }
    this.getVideoData(videoId);
  }

  // Fetch video data from server using the videoId
  getVideoData(videoId: string) {
    this.http.get<VideoType>(environment.baseURL + `Videos/${videoId}`).subscribe(
      {
        next: result => {
          this.mainVideo = result;
          // call getUserVideos() only after getVideoData is completed
          this.getUserVideos();
        },
        error: error => console.error(error)
      }
    );
  }

  // Get 10 More Videos of the current video uploader (user) 
  // excluding the currently playing video (mainVideo)
  getUserVideos() {
    if(this.mainVideo != null) {
      this.http.get<VideoType[]>(environment.baseURL + `Users/${this.mainVideo.user.userId}`).subscribe(
        {
          // remove mainVideo from moreUserVideos List to avoid displaying mainVideo in more Video list
          next: result => this.userVideos = result.filter(video => video.videoId !== this.mainVideo?.videoId),
          error: error => console.error(error)
        }
      );
    }
  }

  viewUserProfile(userId: number) {
    // redirect to /user/:userId
    this.router.navigate(['/user', userId]);
  }

  openAnotherVideo(videoId: number) {
    // redirect to /video/:videoId
    this.router.navigate(['/video', videoId]);
  }

  // Format the timestamp to show day, month, year
  formatDate(timestamp: string): string {
    return formatDate(timestamp, 'dd MMM yyyy', 'en-US');
  }
}
