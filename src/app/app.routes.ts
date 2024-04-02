import { Routes } from '@angular/router';
import { HomepageComponent } from './homepage/homepage.component';
import { UploadComponent } from './upload/upload.component';
import { ChatRoomComponent } from './chat-room/chat-room.component';
import { WatchVideoComponent } from './watch-video/watch-video.component';
import { UserProfileComponent } from './user-profile/user-profile.component';

export const routes: Routes = [
    { path: "", component: HomepageComponent, pathMatch: "full" },
    { path: "upload", component: UploadComponent },
    { path: "chat-room", component: ChatRoomComponent },
    { path: "video/:videoId", component: WatchVideoComponent },
    { path: "user/:userId", component: UserProfileComponent },
];
