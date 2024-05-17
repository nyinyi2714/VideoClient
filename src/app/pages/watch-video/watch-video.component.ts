import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';

import { VideoPlayerComponent } from '../../components/video-player/video-player.component';
import { VideoType } from '../../Types/Video';
import { environment } from '../../../environments/environment.development';
import { UserProfileType } from '../../Types/UserProfile';
import { DateUtils } from '../../utils/date-utils';

@Component({
  selector: 'app-watch-video',
  standalone: true,
  imports: [MatCardModule, MatButtonModule, VideoPlayerComponent, RouterLink],
  templateUrl: './watch-video.component.html',
  styleUrl: './watch-video.component.css'
})
export class WatchVideoComponent implements OnInit {
  mainVideo: VideoType | null = null;
  userVideos: VideoType[] | null = null;

  constructor(
    private http: HttpClient, 
    private route: ActivatedRoute, 
    private router: Router, 
    private dateUtils: DateUtils
  ) { }

  ngOnInit() {
    // Access the video id from the route parameters
    let videoId: string | null = this.route.snapshot.paramMap.get("videoId");

    // Redirect to 404 page if no videoId
    if (!videoId) {
      this.router.navigate(['/page-not-found']);
      return;
    }

    this.getVideoData(videoId);
  }

  changeVideo(videoId: number) {
    this.router.navigate([`/video/${videoId}`]);
    // to reload the video player to play the new video src
    location.reload(); 
  }
  
  // TODO: button to get more video. get total video to determine the end

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
      this.http.get<UserProfileType>(environment.baseURL + `Users/${this.mainVideo.username}`).subscribe(
        {
          // remove mainVideo from moreUserVideos List to avoid displaying mainVideo in more Video list
          next: result => this.userVideos = result.videos.filter(video => video.videoId !== this.mainVideo?.videoId),
          error: error => console.error(error)
        }
      );
    }
  }

  formatDate(timestamp : string) {
    return this.dateUtils.formatDate(timestamp);
  }
}
