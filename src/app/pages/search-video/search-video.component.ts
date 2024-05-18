import { Component, OnInit } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { DateUtils } from '../../utils/date-utils';
import { VideoType } from '../../Types/video';
import { FetchVideoService } from '../../services/video/fetch-video.service';

@Component({
  selector: 'app-search-video',
  standalone: true,
  imports: [RouterLink, MatCardModule, ],
  templateUrl: './search-video.component.html',
  styleUrl: './search-video.component.css'
})
export class SearchVideoComponent implements OnInit {
  searchedVideos: VideoType[] | null = null;
  searchQuery = '';

  constructor(
    private route: ActivatedRoute, 
    private dateUtils: DateUtils,
    private fetchVideoService: FetchVideoService,
  ) { }

  ngOnInit() {
    // Access the searchQuery from the route parameter
    this.searchQuery = this.route.snapshot.paramMap.get("searchQuery") ?? '';

    if(this.searchQuery === null) {
      this.searchedVideos = [];
      return;
    }

    this.fetchVideoService.searchVideosByTitle(this.searchQuery)
    .subscribe({
      next: result => {
        this.searchedVideos = result;
      },
      error: error => {
        console.error(error);
      }
    });

  }

  formatDate(timestamp: string) {
    return this.dateUtils.formatDate(timestamp);
  }
}
