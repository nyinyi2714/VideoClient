import { HttpClient } from '@angular/common/http';
import { Component, OnInit, OnDestroy } from '@angular/core';

import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { UserProfileType } from '../../Types/user-profile';
import { MatCardModule } from '@angular/material/card';
import { DateUtils } from '../../utils/date-utils';
import { AuthService } from '../../services/auth/auth.service';
import { Subject, takeUntil } from 'rxjs';
import { UserService } from '../../services/user/user.service';


@Component({
  selector: 'app-user-profile',
  standalone: true,
  imports: [MatCardModule, RouterLink],
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.css']
})
export class UserProfileComponent implements OnInit, OnDestroy {
  user: UserProfileType | null = null;
  currVideoIndexSkip = 0;
  isLoadingVideos = false;
  isUserAuthorized = false;
  currLoggedInUsername = '';
  private ngUnsubscribe = new Subject();

  constructor(
    private userService: UserService,
    private route: ActivatedRoute,
    private router: Router,
    private dateUtils: DateUtils,
    private authService: AuthService
  ) {
    authService.currUsername.pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(currUsername => {
        this.currLoggedInUsername = currUsername;
      });
  }

  async ngOnInit() {
    // Access the username from the route parameters
    let usernameQuery: string | null = this.route.snapshot.paramMap.get("username");
    // Redirect to 404 page if no username
    if (!usernameQuery) {
      this.router.navigate(['/page-not-found']);
      return;
    }

    // To trigger tokenCheck and save username in auth service
    await this.authService.isAuthenticated();

    this.checkIsUserAuthorized(usernameQuery);
    this.getUserInfo(usernameQuery);
  }

  checkIsUserAuthorized(usernameQuery: string) {
    this.isUserAuthorized = this.currLoggedInUsername === usernameQuery;
  }

  getUserInfo(usernameQuery: string) {
    this.userService.getUserProfile(usernameQuery)
      .subscribe({
        next: result => {
          this.user = result;
        },
        error: error => console.error(error)
      });
  }

  deleteVideo(event: any, videoId: number) {
    event.stopPropagation();
    event.preventDefault();
    event.target.disabled = true;

    this.userService.deleteUserVideo(videoId)
      .subscribe({
        next: result => {
          if (this.user) {
            this.user.videos = this.user.videos.filter(v => v.videoId !== videoId);
            this.user.totalVideos--;
            event.target.disabled = false;
          }
        },
        error: error => {
          console.error(error);
          event.target.disabled = false;
        }
      });
  }

  loadMoreVideos() {
    if (!this.user || !this.user.username) {
      return;
    }

    this.isLoadingVideos = true;
    this.userService.loadMoreVideos(this.user.username, this.currVideoIndexSkip)
      .subscribe({
        next: result => {
          if (this.user) {
            this.user.videos.push(...result.videos);
          }
          this.currVideoIndexSkip++;
          this.isLoadingVideos = false;
        },
        error: error => {
          console.error(error);
          this.isLoadingVideos = false;
        }
      });
  }

  formatDate(timestamp: string) {
    return this.dateUtils.formatDate(timestamp);
  }

  ngOnDestroy() {
    this.ngUnsubscribe.next(true);
    this.ngUnsubscribe.complete();
  }
}

