import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { UserType } from '../Types/User';
import { environment } from '../../environments/environment.development';

@Component({
  selector: 'app-user-profile',
  standalone: true,
  imports: [],
  templateUrl: './user-profile.component.html',
  styleUrl: './user-profile.component.css'
})
export class UserProfileComponent {
  userId: string = '';
  user: UserType | null = null;

  constructor(private http: HttpClient, private route: ActivatedRoute) { }

  ngOnInit() {
    this.getUserId();
    this.getUserInfo();
  }

  // Access the video id from the route parameters
  getUserId() {
    this.route.params.subscribe(params => {
      this.userId = params['videoId'];
    });
  }

  getUserInfo() {
    this.http.get<UserType>(environment.baseURL + `Users/${this.userId}`).subscribe(
      {
        next: result => {
          this.user = result;
        },
        error: error => console.error(error)
      }
    );
  }
}
