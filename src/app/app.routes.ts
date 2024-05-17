import { Routes } from '@angular/router';
import { HomepageComponent } from './pages/homepage/homepage.component';
import { WatchVideoComponent } from './pages/watch-video/watch-video.component';
import { UserProfileComponent } from './pages/user-profile/user-profile.component';
import { PageNotFoundComponent } from './pages/page-not-found/page-not-found.component';
import { RegisterComponent } from './pages/register/register.component';
import { LoginComponent } from './pages/login/login.component';
import { UploadVideoComponent } from './pages/upload-video/upload-video.component';

export const routes: Routes = [
    { path: "", component: HomepageComponent, pathMatch: "full" },
    { path: "upload-video", component: UploadVideoComponent },
    { path: "login", component: LoginComponent },
    { path: "register", component: RegisterComponent },
    { path: "page-not-found", component: PageNotFoundComponent },
    { path: "video/:videoId", component: WatchVideoComponent },
    { path: "user/:username", component: UserProfileComponent },
];
