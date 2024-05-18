import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, throwError } from 'rxjs';
import { VideoType } from '../../Types/video';
import { environment } from '../../../environments/environment.development';
import { UserProfileType } from '../../Types/user-profile';


@Injectable({
  providedIn: 'root'
})
export class FetchVideoService {

  constructor(private http: HttpClient) { }

  getVideoData(videoId: string): Observable<VideoType> {
    return this.http.get<VideoType>(environment.baseURL + `Videos/${videoId}`)
      .pipe(
        catchError(this.handleError)
      );
  }

  getUserVideos(username: string): Observable<UserProfileType> {
    return this.http.get<UserProfileType>(environment.baseURL + `Users/${username}`)
      .pipe(
        catchError(this.handleError)
      );
  }

  private handleError(error: any) {
    console.error('Error occurred:', error);
    return throwError(() => new Error('Something went wrong. Please try again later.'));
  }
}
