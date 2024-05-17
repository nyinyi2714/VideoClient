import { Injectable } from '@angular/core';
import { HttpClient, HttpEvent, HttpEventType, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { environment } from '../../../environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class UploadService {

  constructor(private http: HttpClient) { }

  uploadVideo(file: File, username: string, title: string, description: string): Observable<boolean> {
    const formData: FormData = new FormData();
    formData.append('videoFile', file);
    formData.append('username', username);
    formData.append('title', title);
    formData.append('description', description);

    return this.http.post(`${environment.baseURL}Videos/UploadVideo`, formData, {
      reportProgress: true, observe: 'events'
    }).pipe(
      map((event: HttpEvent<any>) => {
        if (event.type === HttpEventType.Response) {
          return event instanceof HttpResponse && event.status === 200;
        }
        return false;
      }),
      catchError(() => [false]) // Return false if there's an error
    );
  }
}
