import { Routes } from '@angular/router';
import { HomepageComponent } from './homepage/homepage.component';
import { UploadComponent } from './upload/upload.component';

export const routes: Routes = [
    { path: "", component: HomepageComponent, pathMatch: "full" },
    { path: "upload", component: UploadComponent },
];
