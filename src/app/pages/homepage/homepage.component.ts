import { Component, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router'; 
import { MatCardModule } from '@angular/material/card'

import { VideoType } from '../../Types/video';
import { environment } from '../../../environments/environment.development';
import { HttpClient } from '@angular/common/http';
import { DateUtils } from '../../utils/date-utils';
import { VideoPlayerComponent } from '../../components/video-player/video-player.component';

@Component({
  selector: 'app-homepage',
  standalone: true,
  imports: [MatCardModule, RouterLink, VideoPlayerComponent],
  templateUrl: './homepage.component.html',
  styleUrl: './homepage.component.css'
})
export class HomepageComponent implements OnInit {
  public recentVideos : VideoType[] | null = null;
  public popularVideos : VideoType[] | null= null;
  public searchQuery = '';

  constructor(
    private http: HttpClient, 
    private dateUtils: DateUtils, 
    private router: Router
  ) { }

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

  handleSearchInput(event: any) {
    this.searchQuery = event.target.value;
  }

  searchVideos(event : any) {
    event.preventDefault();
    if(this.searchQuery.length <= 0) return;
    this.router.navigate(['/search', this.searchQuery]);
  }

  formatDate(timestamp : string) {
    return this.dateUtils.formatDate(timestamp);
  }
}
