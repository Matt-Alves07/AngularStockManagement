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

  public AddCategory(requestDatas: {name: string}): Observable<Array<getCategoriesResponse>> {
    return this.httpClient.post<Array<getCategoriesResponse>>(
      `${this.API_URL}/category`,
      requestDatas,
      this.httpOptions
    );
  }

  public deleteCategory(requestDatas: {category_id: string}): Observable<void> {
    return this.httpClient.delete<void>(
      `${this.API_URL}/category/delete`,
      {
        ...this.httpOptions,
        params: {
          category_id: requestDatas.category_id,
        },
      },
    );
  }
}
