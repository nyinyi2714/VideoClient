import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { formatDate } from '@angular/common';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { UserProfileType } from '../../Types/UserProfile';
import { environment } from '../../../environments/environment.development';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-user-profile',
  standalone: true,
  imports: [MatCardModule, RouterLink],
  templateUrl: './user-profile.component.html',
  styleUrl: './user-profile.component.css'
})
export class UserProfileComponent implements OnInit {
  user: UserProfileType | null = null;

  constructor(private http: HttpClient, private route: ActivatedRoute, private router: Router) { }

  ngOnInit() {
    // Access the user id from the route parameters
    let username: string | null = this.route.snapshot.paramMap.get("username");
    // Redirect to 404 page if no username 
    if(!username) {
      this.router.navigate(['/page-not-found']);
      return
    }
    this.getUserInfo(username);
  }

  getUserInfo(username: string) {
    this.http.get<UserProfileType>(environment.baseURL + `Users/${username}`).subscribe(
      {
        next: result => {
          this.user = result;
        },
        error: error => console.error(error)
      }
    );
  }

  // Format the timestamp to show day, month, year
  formatDate(timestamp: string): string {
    return formatDate(timestamp, 'dd MMM yyyy', 'en-US');
  }
}
