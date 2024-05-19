import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';

import { VideoPlayerComponent } from '../../components/video-player/video-player.component';
import { VideoType } from '../../Types/video';
import { DateUtils } from '../../utils/date-utils';
import { FetchVideoService } from '../../services/video/fetch-video.service';

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
    private fetchVideoService: FetchVideoService,
    private route: ActivatedRoute,
    private router: Router,
    private dateUtils: DateUtils,
  ) { }

  ngOnInit() {
    // Access the video id from the route parameters
    let videoId: string | null = this.route.snapshot.paramMap.get("videoId");

    // Redirect to 404 page if no videoId
    if (!videoId) {
      this.redirectToPageNotFound();
      return;
    }

    this.getVideoData(videoId);
  }

  changeVideo(videoId: number) {
    this.router.navigateByUrl('/', { skipLocationChange: true }).then(() => {
      this.router.navigate(['/video', videoId]);
    });
  }

  // Fetch video data using the fetchVideoService
  getVideoData(videoId: string) {
    this.fetchVideoService.getVideoData(videoId)
      .subscribe({
        next: result => {
          this.mainVideo = result;
          // Get related videos after main video is fetched
          this.getUserVideos(result.username);
        },
        error: error => {
          console.error(error);
          this.redirectToPageNotFound();
        }
      });
  }

  // Get related videos using the fetchVideoService
  getUserVideos(username: string) {
    if (this.mainVideo) {
      this.fetchVideoService.getUserVideos(username)
        .subscribe({
          next: result => {
            this.userVideos = result.videos.filter(video => video.videoId !== this.mainVideo?.videoId);
          },
          error: error => console.error(error)
        });
    }
  }

  formatDate(timestamp: string) {
    return this.dateUtils.formatDate(timestamp);
  }

  redirectToPageNotFound() {
    this.router.navigate(['/page-not-found']);
  }
}
