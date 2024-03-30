import { Component } from '@angular/core';
import { VideoType } from '../Types/Video';
import { environment } from '../../environments/environment.development';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-homepage',
  standalone: true,
  imports: [],
  templateUrl: './homepage.component.html',
  styleUrl: './homepage.component.css'
})
export class HomepageComponent {
  public videos : VideoType[] = [];
  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.getVideos();
  }

  getVideos() {
    this.http.get<VideoType[]>(environment.baseURL + 'Videos/recent').subscribe(
      {
        next: result => this.videos = result,
        error: error => console.error(error)
      }
    );
  }
}
