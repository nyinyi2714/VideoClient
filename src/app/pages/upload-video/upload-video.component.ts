import { Component } from '@angular/core';
import { UploadService } from '../../services/upload/upload.service';
import { AuthService } from '../../services/auth/auth.service';
import { Subject, takeUntil } from 'rxjs';
import { MatProgressBarModule } from "@angular/material/progress-bar";

@Component({
  selector: 'app-upload-video',
  standalone: true,
  imports: [MatProgressBarModule],
  templateUrl: './upload-video.component.html',
  styleUrl: './upload-video.component.css'
})
export class UploadVideoComponent {
  public file : File | null = null;
  public username = '';
  public uploadSuccessful = false;
  public isUploading = false;
  private ngUnsubscribe = new Subject(); 
  
  constructor(private uploadService: UploadService, private authService : AuthService) {
    authService.currUsername.pipe(takeUntil(this.ngUnsubscribe))
    .subscribe(result => this.username = result);
  }

  onFileSelected(event: any) {
    this.file = event.target.files[0];
  }

  uploadFile(event: Event) {
    event.preventDefault();
    if (this.file) {
      this.uploadService.uploadVideo(this.file, this.username, 'title', 'description')
        .subscribe((success : boolean) => {
          this.uploadSuccessful = success;
        });
    }
  }

  ngOnDestroy() {
    this.ngUnsubscribe.next(true);
    this.ngUnsubscribe.complete();
  }
}
