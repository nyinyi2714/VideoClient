import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';

import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { UserProfileType } from '../../Types/UserProfile';
import { environment } from '../../../environments/environment.development';
import { MatCardModule } from '@angular/material/card';
import { DateUtils } from '../../utils/date-utils';

@Component({
  selector: 'app-user-profile',
  standalone: true,
  imports: [MatCardModule, RouterLink],
  templateUrl: './user-profile.component.html',
  styleUrl: './user-profile.component.css'
})
export class UserProfileComponent implements OnInit {
  user: UserProfileType | null = null;
  currVideoIndexSkip = 0;
  isLoadingVideos = false;
  username = '';

  constructor(
    private http: HttpClient, 
    private route: ActivatedRoute, 
    private router: Router, 
    private dateUtils: DateUtils
  ) { }

  ngOnInit() {
    // Access the user id from the route parameters
    let username: string | null = this.route.snapshot.paramMap.get("username");
    // Redirect to 404 page if no username 
    if(!username) {
      this.router.navigate(['/page-not-found']);
      return
    }
    this.username = username;
    this.getUserInfo();
  }

  getUserInfo() {
    this.http.get<UserProfileType>(
        environment.baseURL + `Users/${this.username}`).subscribe(
      {
        next: result => {
          this.user = result;
        },
        error: error => console.error(error)
      }
    );
  }

  // TODO: Delete button

  loadMoreVideos() {
    this.http.get<UserProfileType>(
      environment.baseURL + `Users/${this.username}${++this.currVideoIndexSkip > 0 
      ? '?skip=' + this.currVideoIndexSkip : ''}`
    ).subscribe(
    {
      next: result => {
        if(this.user) this.user.videos.push(...result.videos);
      },
      error: error => console.error(error)
    }
  );
  }

  formatDate(timestamp : string) {
    return this.dateUtils.formatDate(timestamp);
  }
  
}
