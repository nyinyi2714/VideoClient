import { Injectable } from '@angular/core';
import { HttpClient, HttpEvent, HttpEventType, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../../environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class UploadService {

  constructor(private http: HttpClient) { }

  uploadVideo(file: File, username: string, title: string, description: string): Observable<string> {
    const formData: FormData = new FormData();
    formData.append('videoFile', file);
    formData.append('username', username);
    formData.append('title', title);
    formData.append('description', description);

    return this.http.post(`${environment.baseURL}Videos/UploadVideo`, formData, {
      reportProgress: true,
      observe: 'events'
    }).pipe(
      map((event: HttpEvent<any>) => {
        switch (event.type) {
          case HttpEventType.Sent:
            return 'Uploading';
          case HttpEventType.Response:
            if (event instanceof HttpResponse && event.status === 200) {
              return 'Upload Successful';
            } else {
              return 'Upload Failed';
            }
          default:
            return 'Uploading';
        }
      })
    );
  }
}
