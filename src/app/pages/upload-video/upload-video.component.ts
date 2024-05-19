import { Component, OnInit } from '@angular/core';
import { UploadService } from '../../services/upload/upload.service';
import { AuthService } from '../../services/auth/auth.service';
import { Subject, takeUntil } from 'rxjs';
import { FormControl, ReactiveFormsModule, UntypedFormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-upload-video',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './upload-video.component.html',
  styleUrl: './upload-video.component.css'
})
export class UploadVideoComponent implements OnInit {
  public form!: UntypedFormGroup;
  public videoFile: File | null = null;

  public username = '';
  public uploadStatus = '';
  private ngUnsubscribe = new Subject();

  constructor(private uploadService: UploadService, private authService: AuthService) {
    authService.currUsername.pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(result => this.username = result);
  }
  
  ngOnInit(): void {
    this.form = new UntypedFormGroup({
      title: new FormControl('', Validators.required),
      description: new FormControl('', Validators.required)
    });
  }

  onFileSelected(event: any) {
    const file = event.target.files[0];

    const maxSizeMB = 25; 
    const maxSizeBytes = maxSizeMB * 1024 * 1024; 

     if (file) {
        if (file.size > maxSizeBytes) {
            alert(`The selected file is too large. Maximum allowed size is ${maxSizeMB} MB.`);
            event.target.value = '';
        } else {
            this.videoFile = file;
        }
    }
  }

  uploadVideoFile(event: any) {
    event.preventDefault();
    
    if (this.videoFile !== null) {
      event.target.disabled = true;
      this.uploadService.uploadVideo(
        this.videoFile, 
        this.username,
        this.form.controls['title'].value,
        this.form.controls['description'].value
      )
        .subscribe((status: string) => {
          this.uploadStatus = status;
          if(status !== 'Uploading') {
            event.target.disabled = false;
            this.resetForm();
          }
        });
    }
  }

  resetForm() {
    this.form.reset();
    this.videoFile = null;
    // Clear the file input field 
    const uploadForm: HTMLFormElement = document.querySelector('#upload-form') as HTMLFormElement;
    if (uploadForm) {
      uploadForm.reset();
    }
  }

  ngOnDestroy() {
    this.ngUnsubscribe.next(true);
    this.ngUnsubscribe.complete();
  }
}
