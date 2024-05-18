import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, throwError } from 'rxjs';
import { UserProfileType } from '../../Types/user-profile';
import { environment } from '../../../environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  constructor(private http: HttpClient) { }

  getUserProfile(username: string): Observable<UserProfileType> {
    return this.http.get<UserProfileType>(environment.baseURL + `Users/${username}`)
      .pipe(
        catchError(this.handleError)
      );
  }

  deleteUserVideo(videoId: number): Observable<void> {
    return this.http.delete<void>(environment.baseURL + `Videos/DeleteVideo/${videoId}`)
      .pipe(
        catchError(this.handleError)
      );
  }

  loadMoreVideos(username: string, skip: number): Observable<UserProfileType> {
    return this.http.get<UserProfileType>(environment.baseURL + `Users/${username}${skip > 0 ? '?skip=' + skip : ''}`)
      .pipe(
        catchError(this.handleError)
      );
  }

  private handleError(error: any) {
    console.error('Error occurred:', error);
    return throwError(() => new Error('Something went wrong. Please try again later.'));
  }
}
