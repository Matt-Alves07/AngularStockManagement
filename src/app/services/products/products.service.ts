import { Observable, map } from 'rxjs';
import { Injectable } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import { enviroment } from 'src/environments/enviroment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { GetAllProductsResponse } from 'src/app/Models/Interfaces/products/response/GetAllProductsResponse';
import { DeleteProductResponse } from 'src/app/Models/Interfaces/products/response/DeleteProductResponse';
import { CreateProductRequest } from 'src/app/Models/Interfaces/products/request/create-product-request';
import { CreateProductResponse } from 'src/app/Models/Interfaces/products/response/CreateProductResponse';
import { EditProductRequest } from 'src/app/Models/Interfaces/products/request/edit-product-request';

@Injectable({
  providedIn: 'root'
})
export class ProductsService {
  private API_URL: string = enviroment.API_URL;
  private jwt_token = this.cookie.get('token');
  private httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${this.jwt_token}`,
    }),
  };

  constructor(
    private http: HttpClient,
    private cookie: CookieService
  ) { }

  getAllProducts(): Observable<Array<GetAllProductsResponse>> {
    return this.http
      .get<Array<GetAllProductsResponse>>(
        `${this.API_URL}/products`,
        this.httpOptions
      )
      .pipe(
        map((product) => product.filter((data) => data.amount > 0)),
      );
  }

  deleteProduct(id: string): Observable<DeleteProductResponse> {
    return this.http
      .delete<DeleteProductResponse>(
        `${this.API_URL}/product/delete`,
        {
          ...this.httpOptions, params: {
            product_id: id,
          }
        }
      );
  }

  AddProduct(request: CreateProductRequest): Observable<CreateProductResponse> {
    return this.http
      .post<CreateProductResponse>(
        `${this.API_URL}/product`,
        request,
        this.httpOptions
      );
  }

  EditProduct(request: EditProductRequest): Observable<void> {
    return this.http
      .put<void>(
        `${this.API_URL}/product/edit`,
        request,
        this.httpOptions
      );
  }
}
