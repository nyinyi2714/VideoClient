import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UserType } from '../Types/User';
import { environment } from '../../environments/environment.development';

@Component({
  selector: 'app-user-profile',
  standalone: true,
  imports: [],
  templateUrl: './user-profile.component.html',
  styleUrl: './user-profile.component.css'
})
export class UserProfileComponent implements OnInit {
  user: UserType | null = null;

  constructor(private http: HttpClient, private route: ActivatedRoute, private router: Router) { }

  ngOnInit() {
    // Access the user id from the route parameters
    let userId: string | null = this.route.snapshot.paramMap.get("userId");
    // Redirect to 404 page if no userId 
    if(!userId) {
      this.router.navigate(['/page-not-found']);
      return
    }
    this.getUserInfo(userId);
  }

  getUserInfo(userId: string) {
    this.http.get<UserType>(environment.baseURL + `Users/${userId}`).subscribe(
      {
        next: result => {
          this.user = result;
        },
        error: error => console.error(error)
      }
    );
  }
}
