import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { Observable } from 'rxjs';
import { getCategoriesResponse } from 'src/app/Models/Interfaces/categories/responses/getCategoriesResponse';
import { enviroment } from 'src/environments/enviroment';

@Injectable({
  providedIn: 'root'
})
export class CategoriesService {
  private API_URL: string = enviroment.API_URL;
  private jwt_token = this.cookieService.get('token');
  private httpOptions = {
    headers: new HttpHeaders({
      'Content-type': 'application/json',
      Authorization: `Bearer ${this.jwt_token}`,
    }),
  };

  constructor(
    private httpClient: HttpClient,
    private cookieService: CookieService,
  ) { }

  public getCategories(): Observable<Array<getCategoriesResponse>>{
    return this.httpClient.get<Array<getCategoriesResponse>>(
      `${this.API_URL}/categories`,
      this.httpOptions
    );
  }
}
