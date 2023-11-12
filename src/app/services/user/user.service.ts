import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { enviroment } from 'src/environments/enviroment';
import { AuthRequest } from 'src/app/Models/Interfaces/user/AuthRequest';
import { AuthResponse } from 'src/app/Models/Interfaces/user/AuthResponse';
import { SignupUserRequest } from './../../Models/Interfaces/user/SignupUserRequest';
import { SignupUserResponse } from 'src/app/Models/Interfaces/user/SignupUserResponse';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private API_URL: string = enviroment.API_URL;

  constructor(private http: HttpClient) { }

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
}
