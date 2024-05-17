import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router'; 
import { MatCardModule } from '@angular/material/card'

import { VideoType } from '../../Types/Video';
import { environment } from '../../../environments/environment.development';
import { HttpClient } from '@angular/common/http';
import { DateUtils } from '../../utils/date-utils';

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

  constructor(private http: HttpClient, private dateUtils: DateUtils) {}

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

  formatDate(timestamp : string) {
    return this.dateUtils.formatDate(timestamp);
  }
}
