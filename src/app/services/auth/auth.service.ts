import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { LoginRequest } from '../../Types/login-request';
import { BehaviorSubject, firstValueFrom, Observable, tap } from 'rxjs';
import { LoginResult } from '../../Types/login-result';
import { environment } from '../../../environments/environment.development';
import { RegisterRequest } from '../../Types/register-request';
import { RegisterResult } from '../../Types/register-result';
import { CheckTokenResult } from '../../Types/CheckTokenResult';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  constructor(protected http: HttpClient) { }

  public tokenKey: string = 'tokenKey';
  public _authStatus = new BehaviorSubject<boolean>(false);
  public authStatus = this._authStatus.asObservable();

  public _currUsername = new BehaviorSubject<string>('');
  public currUsername = this._currUsername.asObservable();

  private setAuthStatus(isAuthenticated: boolean) {
    this._authStatus.next(isAuthenticated);
  }

  private setCurrUsername(currUsername: string) {
    this._currUsername.next(currUsername);
  }

  async isAuthenticated(): Promise<boolean> {
    // If no token is stored, return false
    if (this.getToken() === null) return false;

    try {
      const checkTokenResult = await firstValueFrom(this.checkTokenValidity());
      if (!checkTokenResult.isTokenValid) return false;

      // Set current username if the token is valid
      this.setCurrUsername(checkTokenResult.username);
      return true;
      
    } catch (error) {
      // Return false if there's an error
      return false;
    }
  }

  login(loginRequest: LoginRequest): Observable<LoginResult> {
    let url = `${environment.baseURL}Admin/Login`;
    return this.http.post<LoginResult>(url, loginRequest).pipe(tap(loginResult => {
      if (loginResult.success) {
        localStorage.setItem(this.tokenKey, loginResult.token);
        this.setAuthStatus(true);
        this.setCurrUsername(loginResult.username);
      }
    }));
  }

  register(registerRequest: RegisterRequest): Observable<RegisterResult> {
    let url = `${environment.baseURL}Admin/Register`;
    return this.http.post<RegisterResult>(url, registerRequest).pipe(tap(registerResult => {
      if (registerResult.success) {
        localStorage.setItem(this.tokenKey, registerResult.token);
        this.setAuthStatus(true);
        this.setCurrUsername(registerResult.username);
      }
    }));
  }

  checkTokenValidity(): Observable<CheckTokenResult> {
    let url = `${environment.baseURL}Admin/CheckToken`;
    return this.http.get<CheckTokenResult>(url).pipe(tap(CheckTokenResult => {
      if (CheckTokenResult.isTokenValid) {
        this.setAuthStatus(true);
        this.setCurrUsername(CheckTokenResult.username);
      }
    }));
  }

  getToken(): string | null {
    return localStorage.getItem(this.tokenKey);
  }

  logout(): void {
    localStorage.removeItem(this.tokenKey);
    this.setAuthStatus(false);
    this.setCurrUsername('');
  }
}
