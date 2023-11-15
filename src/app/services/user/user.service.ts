import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { enviroment } from 'src/environments/enviroment';
import { AuthRequest } from 'src/app/Models/Interfaces/user/request/AuthRequest';
import { AuthResponse } from 'src/app/Models/Interfaces/user/response/AuthResponse';
import { SignupUserRequest } from './../../Models/Interfaces/user/request/SignupUserRequest';
import { SignupUserResponse } from 'src/app/Models/Interfaces/user/response/SignupUserResponse';
import { CookieService } from 'ngx-cookie-service';
import { Token } from '@angular/compiler';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private API_URL: string = enviroment.API_URL;

  constructor(
    private http: HttpClient,
    private cookieService: CookieService
  ) { }

  signupUser(request: SignupUserRequest): Observable<SignupUserResponse> {
    return this.http.post<SignupUserResponse>(
      `${this.API_URL}/user`,
      request
    );
  }

  authUser(request: AuthRequest): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(
      `${this.API_URL}/auth`,
      request
    );
  }

  isLoggedIn(): boolean {
    const TOKEN = this.cookieService.get('token');

    return TOKEN ? true : false;
  }
}
