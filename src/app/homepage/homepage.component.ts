import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router'; 

import { formatDate } from '@angular/common';
import { MatCardModule } from '@angular/material/card'

import { VideoType } from '../Types/Video';
import { environment } from '../../environments/environment.development';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-homepage',
  standalone: true,
  imports: [MatCardModule],
  templateUrl: './homepage.component.html',
  styleUrl: './homepage.component.css'
})
export class HomepageComponent implements OnInit {
  public recentVideos : VideoType[] = [];
  public popularVideos : VideoType[] = [];

  constructor(private http: HttpClient, private router: Router) {}

  ngOnInit() {
    this.getRecentVideos();
    this.getPopularVideos();
  }

  getRecentVideos() {
    this.http.get<VideoType[]>(environment.baseURL + 'Videos/recent').subscribe(
      {
        next: result => this.recentVideos = result,
        error: error => console.error(error)
      }
    );
  }

  getPopularVideos() {
    this.http.get<VideoType[]>(environment.baseURL + 'Videos/popular').subscribe(
      {
        next: result => this.popularVideos = result,
        error: error => console.error(error)
      }
    );
  }

  openVideo(videoId: number) {
    // redirect to /video/:id
    this.router.navigate(['/video', videoId]);
  }

  // Format the timestamp to show day, month, year
  formatDate(timestamp: string): string {
    return formatDate(timestamp, 'dd MMM yyyy', 'en-US');
  }
}
