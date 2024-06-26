import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { NavBarComponent } from "./components/nav-bar/nav-bar.component";
import { HomepageComponent } from './pages/homepage/homepage.component';

@Component({
    selector: 'app-root',
    standalone: true,
    templateUrl: './app.component.html',
    styleUrl: './app.component.css',
    imports: [
      RouterOutlet, HomepageComponent, HttpClientModule, NavBarComponent,
    ]
})
export class AppComponent {
  title = 'VideoClient';
}
