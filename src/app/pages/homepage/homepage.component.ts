import { Component, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router'; 

import { formatDate } from '@angular/common';
import { MatCardModule } from '@angular/material/card'

import { VideoType } from '../../Types/Video';
import { environment } from '../../../environments/environment.development';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-homepage',
  standalone: true,
  imports: [MatCardModule, RouterLink],
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
    this.http.get<VideoType[]>(environment.baseURL + 'Videos/Recent').subscribe(
      {
        next: result => this.recentVideos = result,
        error: error => console.error(error)
      }
    );
  }

  getPopularVideos() {
    this.http.get<VideoType[]>(environment.baseURL + 'Videos/Popular').subscribe(
      {
        next: result => this.popularVideos = result,
        error: error => console.error(error)
      }
    );
  }

  // Format the timestamp to show day, month, year
  formatDate(timestamp: string): string {
    return formatDate(timestamp, 'dd MMM yyyy', 'en-US');
  }
}
