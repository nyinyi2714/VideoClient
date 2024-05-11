import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { LoginRequest } from './login-request';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { LoginResult } from './login-result';
import { environment } from '../../environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(protected http: HttpClient) { }

  public tokenKey: string = 'tokenKey';
  public _authStatus = new BehaviorSubject<boolean>(false);
  public authStatus = this._authStatus.asObservable();

  init(): void {
    this.setAuthStatus(this.isAuthenticated());
  }

  private setAuthStatus(isAuthenticated: boolean) {
    this._authStatus.next(isAuthenticated);
  }

  isAuthenticated(): boolean {
    return this.getToken() !== null;
  } 

  login(loginRequest: LoginRequest): Observable<LoginResult> {
    let url = `${environment.baseURL}api/Admin/Login`;
    return this.http.post<LoginResult>(url, loginRequest).pipe(tap(loginResult => {
      if(loginResult.success) {
        localStorage.setItem(this.tokenKey, loginResult.token);
        this.setAuthStatus(true);
      }
    }));
  }

  getToken():string | null {
    return localStorage.getItem(this.tokenKey);
  }

  logout(): void {
    localStorage.removeItem(this.tokenKey);
    this.setAuthStatus(false);
  }
}
