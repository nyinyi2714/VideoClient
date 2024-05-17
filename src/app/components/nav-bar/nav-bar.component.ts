import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router, RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';
import { MatIconModule } from "@angular/material/icon";
import { MatToolbarModule } from "@angular/material/toolbar";
import { MatButtonModule } from "@angular/material/button";
import { Subject, takeUntil } from 'rxjs';
import { AuthService } from '../../services/auth/auth.service';

@Component({
  selector: 'app-nav-bar',
  standalone: true,
  imports: [
    RouterOutlet,
    RouterLink,
    RouterLinkActive,
    MatIconModule,
    MatToolbarModule,
    MatButtonModule,
  ],
  templateUrl: './nav-bar.component.html',
  styleUrl: './nav-bar.component.css'
})
 
export class NavBarComponent implements OnInit, OnDestroy {
  isLoggedIn = false;
  username = '';
  private ngUnsubscribe = new Subject(); 

  constructor(private authService : AuthService, private router : Router) {
    authService.authStatus.pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(result => this.isLoggedIn = result);

    authService.currUsername.pipe(takeUntil(this.ngUnsubscribe))
      .subscribe(result => this.username = result);
  }

  async ngOnInit() {
    try {
      this.isLoggedIn = await this.authService.isAuthenticated();
    } catch (error) {
      this.isLoggedIn = false;
    }
  }

  ngOnDestroy() {
    this.ngUnsubscribe.next(true);
    this.ngUnsubscribe.complete();
  }

  onLogout(): void {
    this.authService.logout();
    this.router.navigate(['/']);
  }
}
