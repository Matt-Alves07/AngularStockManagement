import { BehaviorSubject, map, take } from 'rxjs';
import { Injectable } from '@angular/core';
import { GetAllProductsResponse } from 'src/app/Models/Interfaces/products/response/GetAllProductsResponse';

@Injectable({
  providedIn: 'root'
})
export class ProductsDataTransferService {
  public productsDatas: Array<GetAllProductsResponse> = [];
  public productsDataEmitter$ = new BehaviorSubject<Array<GetAllProductsResponse> | null>(null);

  constructor() { }

  setProductsData(products: Array<GetAllProductsResponse>): void {
    if (products) {
      this.productsDataEmitter$.next(products);
      this.getProductsData();
    }
  }

  getProductsData() {
    this.productsDataEmitter$
      .pipe(
        take(1),
        map((data) => data?.filter((product) => product.amount > 0)),
      )
      .subscribe({
        next: (response) => {
          if (response){
            this.productsDatas = response;
          }
        }
      });

    return this.productsDatas;
  }
}
