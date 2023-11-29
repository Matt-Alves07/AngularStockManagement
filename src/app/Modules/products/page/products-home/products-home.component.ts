import { ProductsService } from 'src/app/services/products/products.service';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subject, takeUntil } from 'rxjs';
import { ProductsDataTransferService } from 'src/app/shared/services/products/products-data-transfer.service';
import { Router } from '@angular/router';
import { GetAllProductsResponse } from 'src/app/Models/Interfaces/products/response/GetAllProductsResponse';
import { ConfirmationService, MessageService } from 'primeng/api';
import { EventAction } from 'src/app/Models/Interfaces/products/event/event-action';

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
    private confirmationService: ConfirmationService,
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

  handleProductAction(event: EventAction): void {
    this.messageService.add({
      severity: 'success',
      summary: 'Success',
      detail: 'Product ID: ' + event.id + ', action: ' + event.action,
      life: 5000
    })
  }

  handleProductDeleteAction(event: { productId: string, productName: string}) : void {
    this.confirmationService.confirm({
      message: `Do you really want to delete the product: ${event.productName}?`,
      header: 'Confirm delete product',
      icon: 'pi pi-exclamation-triangle',
      acceptLabel: 'Yes',
      rejectLabel: 'No',
      accept: () => this.deleteProduct(event?.productId),
    });
  }

  deleteProduct(id: string): void {
    if (id) {
      this.productsService
        .deleteProduct(id)
          .pipe(takeUntil(this.destroy$))
          .subscribe({
            next: (response) => {
              this.messageService.add({
                severity: 'success',
                summary: 'Success',
                detail: 'Product deleted successfully.',
                life: 5000,
              });

              this.getAPIProductsDatas();
            }, error: (err) => {
              this.messageService.add({
                severity: 'error',
                summary: 'Error',
                detail: 'Error deleting the product.',
                life: 5000
              });
            }
          });
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

}
