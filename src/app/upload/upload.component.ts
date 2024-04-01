import { Component } from '@angular/core';
import { initializeApp } from 'firebase/app';
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { environment } from '../../environments/environment.development';

@Component({
  selector: 'app-upload',
  templateUrl: './upload.component.html',
  styleUrl: './upload.component.css'
})
export class UploadComponent {
  selectedFile: File | null = null;
  uploadProgress: number = 0;
  uploadState: string = '';
  downloadURL: string | null = null;

  constructor() {
    initializeApp(environment.firebaseConfig);
  }

  resetUploadInfo() {
    this.uploadProgress = 0;
    this.uploadState = '';
    this.downloadURL = null;
  }

  onFileSelected(event: any) {
    this.selectedFile = event.target.files[0];
    // Reset upload info on new file selection
    this.resetUploadInfo(); 
  }

  async uploadFile() {
    // Handle no file selected case
    if (!this.selectedFile) {
      return; 
    }

    const storage = getStorage();
    const storageRef = ref(storage, `uploads/${this.selectedFile.name}`);
    // Set content type based on file
    const metadata = { contentType: this.selectedFile.type };

    try {
      const uploadTask = uploadBytesResumable(storageRef, this.selectedFile, metadata);

      uploadTask.on(
        'state_changed',
        (snapshot) => {
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          this.uploadProgress = Math.floor(progress);
          this.uploadState = snapshot.state;
        },
        (error) => {
          console.error('Upload error:', error);
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref)
            .then((downloadURL) => {
              this.downloadURL = downloadURL;
              console.log('File available at:', downloadURL);
            });
        }
      );
    } catch (error) {
      console.error('Error during upload:', error);
    }
  }
}
