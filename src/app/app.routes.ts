import { Routes } from '@angular/router';
import { HomepageComponent } from './homepage/homepage.component';
import { UploadComponent } from './upload/upload.component';
import { ChatRoomComponent } from './chat-room/chat-room.component';
import { WatchVideoComponent } from './watch-video/watch-video.component';
import { UserProfileComponent } from './user-profile/user-profile.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';

export const routes: Routes = [
    { path: "", component: HomepageComponent, pathMatch: "full" },
    { path: "upload", component: UploadComponent },
    { path: "chat-room", component: ChatRoomComponent },
    { path: "page-not-found", component: PageNotFoundComponent },
    { path: "video/:videoId", component: WatchVideoComponent },
    { path: "user/:userId", component: UserProfileComponent },
];
