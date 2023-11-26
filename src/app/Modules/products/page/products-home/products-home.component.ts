import { ProductsService } from 'src/app/services/products/products.service';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { ProductsDataTransferService } from 'src/app/shared/services/products/products-data-transfer.service';
import { Router } from '@angular/router';
import { GetAllProductsResponse } from 'src/app/Models/Interfaces/products/response/GetAllProductsResponse';
import { MessageService } from 'primeng/api';

@Component({
  selector: 'app-products-home',
  templateUrl: './products-home.component.html',
  styleUrls: ['./products-home.component.scss']
})
export class ProductsHomeComponent implements OnInit, OnDestroy {
  private readonly destroy$: Subject<void> = new Subject();

  public productsList: Array<GetAllProductsResponse> = [];

  constructor (
    private router: Router,
    private messageService: MessageService,
    private productsService: ProductsService,
    private productDtService: ProductsDataTransferService,
  ) {}

  ngOnInit(): void {
    this.GetServiceProductsData();
  }

  GetServiceProductsData() {
    const productsLoaded = this.productDtService.getProductsData();

    if (productsLoaded.length > 0)
      this.productsList = productsLoaded;
    else
      this.getAPIProductsDatas();
  }

  getAPIProductsDatas() {
    this.productsService
      .getAllProducts()
        .pipe(takeUntil(this.destroy$))
      .subscribe({
        next: (response) => {
          if (response.length > 0)
            this.productsList = response;
        },
        error: (err) => {
          console.error(err);
          this.router.navigate(['/dashboard']);
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Error retrieving products data',
            life: 5000
          });
        }
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

}
